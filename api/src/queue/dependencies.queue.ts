import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { readFileSync } from 'fs';
import { BullQueueEvents, OnQueueEvent, Process, Processor } from 'nest-bull';
import { GithubService } from '../github/github.service';
import { RepositoryService } from '../repository/repository.service';
import {
  getDependenciesCount,
  getFrameworkFromPackageJson,
  getNbOutdatedDeps,
  getPrefixedDependencies,
  getUpgradedDiff,
} from '../utils/dependencies';

const { exec, execSync } = require('child_process');
const fs = require('fs');
const { promisify } = require('util');
const asyncWriteFile = promisify(fs.writeFile);

@Processor({ name: 'dependencies' })
export class DependenciesQueue {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private repositoriesService: RepositoryService,
    private readonly githubService: GithubService,
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
      const manifest = JSON.parse(stdout.split('\n')[1]);
      const outdatedDeps = manifest.data.body;
      const [nbOutdatedDeps, nbOutdatedDevDeps] = getNbOutdatedDeps(
        outdatedDeps,
      );

      repository.packageJson = JSON.parse(bufferPackage.toString('utf-8'));
      const totalDependencies = getDependenciesCount(repository.packageJson);

      const score = Math.round(
        101 - ((nbOutdatedDeps + nbOutdatedDevDeps) / totalDependencies) * 100,
      );

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
      await this.repositoriesService.updateRepo(
        repository.id.toString(),
        repository,
      );
      exec(`cd ${tmpPath} && cd .. && rm -rf ./${repositoryId}`);
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
      // { stdio: 'inherit' },
    );

    // // Commit the new package.json and yarn.lock and create new PR
    const newBranchName = 'reactivatedapp/' + Date.now();
    try {
      await this.githubService.createBranch({
        fullName: job.data.repositoryFullName,
        githubToken: job.data.githubToken,
        branchName: newBranchName,
      });
    } catch (error) {
      if (error.response.status === 422) {
        this.logger.error('Branch reference already exists');
      }
    }

    // Update the files on new branch
    let commitSHA = null;
    try {
      const files = ['package.json', 'yarn.lock'];
      for (const file of files) {
        const bufferContent = readFileSync(`${tmpPath}/${file}`, {
          encoding: 'base64',
        });
        const res = await this.githubService.commitFile({
          name: job.data.repositoryFullName,
          path: job.data.path,
          branch: newBranchName,
          token: job.data.githubToken,
          fileName: file,
          message: `Upgrade ${file}`,
          content: bufferContent,
        });

        if (file === 'package.json') {
          commitSHA = res.data.commit.sha;
        }
      }

      const diffRes = await this.githubService.getDiffUrl({
        name: job.data.repositoryFullName,
        token: job.data.githubToken,
        commitSHA,
      });

      const diffLines = diffRes.data.split('\n');
      console.log('upgradeDependencies -> diffLines', diffLines);
      const upgradedDiff = getUpgradedDiff(diffLines);
      console.log('upgradeDependencies -> upgradedDiff', upgradedDiff);

      await this.githubService.createPullRequest({
        baseBranch: job.data.branch,
        fullName: job.data.repositoryFullName,
        githubToken: job.data.githubToken,
        headBranch: newBranchName,
        updatedDependencies: job.data.updatedDependencies,
        upgradedDiff,
      });
    } catch (error) {
      this.logger.error('Commit files and create PR', error);
    }

    // Delete the yarn.lock, package.json, node_modules
    exec(`cd ${tmpPath} && cd .. && rm -rf ./${job.data.repositoryId}`);
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${
        job.name
      } with result (${job.finishedOn - job.processedOn} ms)`,
    );
  }

  @OnQueueEvent(BullQueueEvents.FAILED)
  onFailed(job: Job) {
    this.logger.log(
      `Failed job ${job.id} of type ${job.name}.\n${job.stacktrace}`,
    );
  }
}
