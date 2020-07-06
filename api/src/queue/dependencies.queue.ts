import {
  BullQueueEvents,
  OnQueueActive,
  OnQueueEvent,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { readFileSync } from 'fs';
import { GithubService, ITreeData } from '../github/github.service';
import { LogService } from '../log/log.service';
import { RepositoryService } from '../repository/repository.service';
import {
  getDependenciesCount,
  getFrameworkFromPackageJson,
  getNbOutdatedDeps,
  getPrefixedDependencies,
  getUpgradedDiff,
} from '../utils/dependencies';
import { PullRequestService } from '../pull-request/pull-request.service';

const { exec, execSync } = require('child_process');
const fs = require('fs');
const { promisify } = require('util');
const asyncWriteFile = promisify(fs.writeFile);

@Processor('dependencies')
@Injectable()
export class DependenciesQueue {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly repositoriesService: RepositoryService,
    private readonly githubService: GithubService,
    private readonly logService: LogService,
    private readonly pullRequestService: PullRequestService,
  ) {}

  @Process({ name: 'compute_yarn_dependencies' })
  async computeYarnDependencies(job: Job) {
    this.refreshDependencies(job);
  }

  async refreshDependencies(job: Job) {
    const { repositoryId } = job.data;
    const {
      responsePackageJson,
      responseLock,
      hasYarnLock,
    } = await this.getDependenciesFiles(job);
    const repository = await this.repositoriesService.findRepo({
      githubId: repositoryId,
    });

    const tmpPath = `tmp/${repositoryId}`;
    const { bufferPackage } = await this.createTemporaryFiles(
      tmpPath,
      responsePackageJson,
      responseLock,
      hasYarnLock,
    );

    if (!hasYarnLock) {
      // Generate yarn.lock from package-lock.json
      execSync(`cd ${tmpPath} && yarn import`);
    }

    exec(`cd ${tmpPath} && yarn outdated --json`, async (err, stdout) => {
      try {
        let manifest = null,
          outdatedDeps = [];

        manifest = JSON.parse(stdout.split('\n')[1]);
        outdatedDeps = manifest.data.body;

        const [nbOutdatedDeps, nbOutdatedDevDeps] = getNbOutdatedDeps(
          outdatedDeps,
        );

        repository.packageJson = JSON.parse(bufferPackage.toString('utf-8'));
        const totalDependencies = getDependenciesCount(repository.packageJson);

        let score = Math.round(
          100 -
            ((nbOutdatedDeps + nbOutdatedDevDeps) / totalDependencies) * 100,
        );
        if (score === 0) {
          score += 1; // Show load bar for the front
        }

        this.logger.log('score : ' + score);

        const deps = getPrefixedDependencies(outdatedDeps);
        repository.dependencies = {
          deps,
        };
        repository.score = score;
        repository.framework = getFrameworkFromPackageJson(
          repository.packageJson,
        );

        repository.isConfigured = true;
        repository.dependenciesUpdatedAt = new Date();
        repository.crawlError = '';
        await this.repositoriesService.updateRepo(
          repository.id.toString(),
          repository,
        );

        this.logger.log('updated repo : ' + repository.fullName);
        exec(`cd ${tmpPath} && cd .. && rm -rf ./${repositoryId}`);
      } catch (err) {
        this.logger.error(`${err.name} ${err.message} ${err.stack}`);
        await this.repositoriesService.updateRepo(repository.id.toString(), {
          ...repository,
          crawlError: err.message,
        });
        exec(`cd ${tmpPath} && cd .. && rm -rf ./${repositoryId}`);
      }
    });
  }

  async createTemporaryFiles(
    tmpPath: string,
    responsePackageJson,
    responseLock,
    hasYarnLock: boolean,
  ) {
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }
    const bufferPackage = Buffer.from(
      responsePackageJson.data.content,
      'base64',
    );
    await asyncWriteFile(
      `${tmpPath}/package.json`,
      bufferPackage.toString('utf-8'),
    );
    const bufferLock = Buffer.from(responseLock.data.content, 'base64');
    if (hasYarnLock) {
      await asyncWriteFile(
        `${tmpPath}/yarn.lock`,
        bufferLock.toString('utf-8'),
      );
    } else {
      await asyncWriteFile(
        `${tmpPath}/package-lock.json`,
        bufferLock.toString('utf-8'),
      );
    }
    return { bufferPackage };
  }

  async getDependenciesFiles(job: Job) {
    const responsePackageJson = await this.githubService.getFile({
      name: job.data.repositoryFullName,
      path: job.data.path,
      branch: job.data.branch,
      token: job.data.githubToken,
      fileName: 'package.json',
    });

    let responseLock = null;
    const hasYarnLock = job.data.hasYarnLock;
    if (hasYarnLock) {
      responseLock = await this.githubService.getFile({
        name: job.data.repositoryFullName,
        path: job.data.path,
        branch: job.data.branch,
        token: job.data.githubToken,
        fileName: 'yarn.lock',
      });
    } else {
      responseLock = await this.githubService.getFile({
        name: job.data.repositoryFullName,
        path: job.data.path,
        branch: job.data.branch,
        token: job.data.githubToken,
        fileName: 'package-lock.json',
      });
    }

    return { responsePackageJson, responseLock, hasYarnLock };
  }

  @Process({ name: 'upgrade_dependencies' })
  async upgradeDependencies(job: Job) {
    const {
      responsePackageJson,
      responseLock,
      hasYarnLock,
    } = await this.getDependenciesFiles(job);

    const tmpPath = `tmp/${job.data.repositoryId}`;

    await this.createTemporaryFiles(
      tmpPath,
      responsePackageJson,
      responseLock,
      hasYarnLock,
    );

    if (!hasYarnLock) {
      execSync(`cd ${tmpPath} && yarn import`);
      fs.unlinkSync(`${tmpPath}/package-lock.json`);
    }

    // Install all dependencies
    execSync(`cd ${tmpPath} && yarn install --force --ignore-scripts`);
    // Upgrade the selected dependencies
    this.logger.log(
      `Running : yarn upgrade ${job.data.updatedDependencies.join(' ')}`,
    );

    execSync(
      `cd ${tmpPath} && yarn upgrade ${job.data.updatedDependencies.join(' ')}`,
    );

    // Commit the new package.json and yarn.lock and create new PR
    let branchTreeSHA = null;
    try {
      const branchRes = await this.githubService.createBranch({
        fullName: job.data.repositoryFullName,
        githubToken: job.data.githubToken,
        branchName: job.data.branchName,
        baseBranch: job.data.branch,
      });
      branchTreeSHA = branchRes.data.object.sha;
    } catch (error) {
      if (error.response.status === 422) {
        this.logger.error('Branch reference already exists');
      }
      await this.logService.saveLog({
        name: `Create new branch`,
        failedReason: `${error}`,
        data: JSON.parse(JSON.stringify(error)),
      });
    }

    // Update the files on new branch
    try {
      const files = ['package.json', 'yarn.lock'];
      const tree: ITreeData[] = [];
      for (const file of files) {
        const bufferContent = Buffer.from(readFileSync(`${tmpPath}/${file}`));

        tree.push({
          path: `${job.data.path === '/' ? file : job.data.path + file} `,
          mode: '100644',
          type: 'blob',
          content: bufferContent.toString('utf-8'),
        });
      }

      const upgradedTreeRes = await this.githubService.createTree({
        fullName: job.data.repositoryFullName,
        githubToken: job.data.githubToken,
        base_tree: branchTreeSHA,
        tree,
      });

      const commitRes = await this.githubService.createCommit({
        fullName: job.data.repositoryFullName,
        githubToken: job.data.githubToken,
        message: `Reactivated App : update package.json and yarn.lock`,
        tree: upgradedTreeRes.data.sha,
        parents: [branchTreeSHA],
      });
      const upgradeCommitSHA = commitRes.data.sha;

      const diffRes = await this.githubService.getDiffUrl({
        name: job.data.repositoryFullName,
        token: job.data.githubToken,
        commitSHA: upgradeCommitSHA,
      });

      const diffLines = diffRes.data.split('\n');
      const upgradedDiff = getUpgradedDiff(diffLines);

      await this.githubService.updateBranch({
        sha: upgradeCommitSHA,
        githubToken: job.data.githubToken,
        branchName: job.data.branchName,
        fullName: job.data.repositoryFullName,
      });

      await this.githubService.createPullRequest({
        baseBranch: job.data.branch,
        fullName: job.data.repositoryFullName,
        githubToken: job.data.githubToken,
        headBranch: job.data.branchName,
        updatedDependencies: job.data.updatedDependencies,
        upgradedDiff,
      });
    } catch (error) {
      this.logger.error('Commit files and create PR', error);
      await this.logService.saveLog({
        name: `Commit files and create PR`,
        failedReason: `${error}`,
        data: JSON.parse(JSON.stringify(error)),
      });
      await this.pullRequestService.updatePullRequest(job.data.branchName, {
        status: 'error',
      });
    }

    // Delete the yarn.lock, package.json, node_modules
    exec(`cd ${tmpPath} && cd .. && rm -rf ./${job.data.repositoryId}`);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `[${process.pid}] Processing job ${job.id} of type ${
        job.name
      } with data ${JSON.stringify(job.data, null, '	')}...`,
    );
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${
        job.name
      } with result (${job.finishedOn - job.processedOn} ms)`,
    );
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: Error) {
    await this.logService.saveLog({
      name: `Job failed : ${job.name}`,
      stackTrace: `${job.stacktrace[0].slice(0, 500)}`,
      failedReason: `${job.failedReason}`,
      data: JSON.parse(JSON.stringify(job.data)),
    });

    this.logger.error(
      `Failed job ${job.id} of type ${job.name}.\n${job.stacktrace}\n$Error : ${error.message}`,
    );
  }
}
