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
    const {
      responsePackageJson,
      responseLock,
      hasYarnLock,
    } = await this.getDependenciesFiles(job);

    const path = `tmp/${job.data.repositoryId}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const bufferPackage = Buffer.from(
      responsePackageJson.data.content,
      'base64',
    );

    await asyncWriteFile(
      `${path}/package.json`,
      bufferPackage.toString('utf-8'),
    );

    const bufferLock = Buffer.from(responseLock.data.content, 'base64');

    if (hasYarnLock) {
      await asyncWriteFile(`${path}/yarn.lock`, bufferLock.toString('utf-8'));
    } else {
      await asyncWriteFile(
        `${path}/package-lock.json`,
        bufferLock.toString('utf-8'),
      );
    }

    const repository = await this.repositoriesService.findRepo({
      githubId: job.data.repositoryId,
    });

    if (!hasYarnLock) {
      // Generate yarn.lock from package-lock.json
      execSync(`cd ${path} && yarn import`);
    }

    exec(`cd ${path} && yarn outdated --json`, async (err, stdout) => {
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

      await this.repositoriesService.updateRepo(
        repository.id.toString(),
        repository,
      );
      exec(`cd ${path} && cd .. && rm -rf ./${job.data.repositoryId}`);
    });
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
    console.log('getDependenciesFiles -> hasYarnLock', hasYarnLock);
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
    try {
      const {
        responsePackageJson,
        responseLock,
        hasYarnLock,
      } = await this.getDependenciesFiles(job);

      const path = `tmp/${job.data.repositoryId}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      const bufferPackage = Buffer.from(
        responsePackageJson.data.content,
        'base64',
      );

      await asyncWriteFile(
        `${path}/package.json`,
        bufferPackage.toString('utf-8'),
      );

      const bufferLock = Buffer.from(responseLock.data.content, 'base64');

      if (hasYarnLock) {
        await asyncWriteFile(`${path}/yarn.lock`, bufferLock.toString('utf-8'));
      } else {
        await asyncWriteFile(
          `${path}/package-lock.json`,
          bufferLock.toString('utf-8'),
        );
        execSync(`cd ${path} && yarn import`);
        fs.unlinkSync(`${path}/package-lock.json`);
      }

      // Install all dependencies
      execSync(`cd ${path} && yarn install --force`);
      // Upgrade the selected dependencies
      execSync(
        `cd ${path} && yarn upgrade ${job.data.updatedDependencies.join(' ')}`,
        { stdio: 'inherit' },
      );

      // // Commit the new package.json and yarn.lock and create new PR
      const newBranchName = 'test';
      let newBranchSHA = null;
      try {
        const newBranchRes = await this.githubService.createBranch({
          fullName: job.data.repositoryFullName,
          githubToken: job.data.githubToken,
          branchName: newBranchName,
        });
        newBranchSHA = newBranchRes.data.object.sha;
      } catch (error) {
        if (error.response.status === 422) {
          // this.logger.error('Reference already exists');
          const branchRefRes = await this.githubService.getSingleRef({
            fullName: job.data.repositoryFullName,
            branchName: newBranchName,
            token: job.data.githubToken,
          });
          newBranchSHA = branchRefRes.data.object.sha;
        }
      }

      // Update the files on new branch
      const files = ['package.json', 'yarn.lock'];
      for (const file of files) {
        const bufferContent = readFileSync(`${path}/${file}`, {
          encoding: 'base64',
        });
        await this.githubService.commitFile({
          name: job.data.repositoryFullName,
          path: job.data.path,
          branch: newBranchName,
          token: job.data.githubToken,
          fileName: file,
          message: `Upgrade ${file}`,
          content: bufferContent,
        });
      }

      this.githubService.createPullRequest({
        baseBranch: job.data.branch,
        fullName: job.data.repositoryFullName,
        githubToken: job.data.githubToken,
        headBranch: newBranchName,
        updatedDependencies: job.data.updatedDependencies,
      });

      // Delete the yarn.lock, package.json, node_modules
      exec(`cd ${path} && cd .. && rm -rf ./${job.data.repositoryId}`);
    } catch (error) {
      this.logger.debug(
        'upgradeDependencies -> error',
        JSON.stringify(error, null, '	'),
      );
    }
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
