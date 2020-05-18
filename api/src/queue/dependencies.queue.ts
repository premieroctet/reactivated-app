import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BullQueueEvents, OnQueueEvent, Process, Processor } from 'nest-bull';
import { GithubService } from '../github/github.service';
import { RepositoryService } from '../repository/repository.service';
import {
  getDependenciesCount,
  getFrameworkFromPackageJson,
  getNbOutdatedDeps,
  getPrefixedDependencies,
} from '../utils/dependencies';
import { execSync } from 'child_process';

const { exec } = require('child_process');
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
    const responsePackageJson = await this.githubService.getPackageJson({
      name: job.data.repositoryFullName,
      path: job.data.path,
      branch: job.data.branch,
      token: job.data.githubToken,
    });

    let responseLock = null;
    const hasYarnLock = job.data.hasYarnLock;
    if (hasYarnLock) {
      responseLock = await this.githubService.getYarnLock({
        name: job.data.repositoryFullName,
        path: job.data.path,
        branch: job.data.branch,
        token: job.data.githubToken,
      });
    } else {
      responseLock = await this.githubService.getPackageLockJson({
        name: job.data.repositoryFullName,
        path: job.data.path,
        branch: job.data.branch,
        token: job.data.githubToken,
      });
    }

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

    console.log(
      'DependenciesQueue -> computeYarnDependencies -> hasYarnLock',
      hasYarnLock,
    );
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

    exec(
      `cd ${path} && yarn outdated --json && cd .. && rm -rf ./${job.data.repositoryId}`,
      async (err, stdout) => {
        const manifest = JSON.parse(stdout.split('\n')[1]);
        const outdatedDeps = manifest.data.body;
        const [nbOutdatedDeps, nbOutdatedDevDeps] = getNbOutdatedDeps(
          outdatedDeps,
        );

        repository.packageJson = JSON.parse(bufferPackage.toString('utf-8'));
        const totalDependencies = getDependenciesCount(repository.packageJson);

        const score = Math.round(
          101 -
            ((nbOutdatedDeps + nbOutdatedDevDeps) / totalDependencies) * 100,
        );

        const deps = getPrefixedDependencies(outdatedDeps);
        repository.dependencies = {
          // deps: outdatedDeps,
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
      },
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

  @OnQueueEvent(BullQueueEvents.FAILED)
  onFailed(job: Job) {
    this.logger.log(
      `Failed job ${job.id} of type ${job.name}.\n${job.stacktrace}`,
    );
  }
}
