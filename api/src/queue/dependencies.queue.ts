import { BullQueueEvents, OnQueueEvent, Processor, Process } from 'nest-bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { GithubService } from '../github/github.service';
import {
  getNbOutdatedDeps,
  getDependenciesCount,
  getFrameworkFromPackageJson,
  getDependenciesByFirstLetter,
} from '../utils/dependencies';

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

    const responseYarnLock = await this.githubService.getYarnLock({
      name: job.data.repositoryFullName,
      path: job.data.path,
      branch: job.data.branch,
      token: job.data.githubToken,
    });

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

    const bufferLock = Buffer.from(responseYarnLock.data.content, 'base64');

    await asyncWriteFile(`${path}/yarn.lock`, bufferLock.toString('utf-8'));

    const repository = await this.repositoriesService.findRepo({
      githubId: job.data.repositoryId,
    });

    exec(
      `cd ${path} && yarn outdated --json && cd .. && rm -rf ./${job.data.repositoryId}`,
      async (err, stdout) => {
        const manifest = JSON.parse(stdout.split('\n')[1]);
        const deps = manifest.data.body;

        const [nbOutdatedDeps, nbOutdatedDevDeps] = getNbOutdatedDeps(deps);

        repository.packageJson = JSON.parse(bufferPackage.toString('utf-8'));
        const totalDependencies = getDependenciesCount(repository.packageJson);

        const score = Math.round(
          101 -
            ((nbOutdatedDeps + nbOutdatedDevDeps) / totalDependencies) * 100,
        );

        repository.dependencies = {
          deps,
        };
        repository.score = score;
        repository.framework = getFrameworkFromPackageJson(
          repository.packageJson,
        );
        repository.sortedDependencies = getDependenciesByFirstLetter(
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
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result`);
  }

  @OnQueueEvent(BullQueueEvents.FAILED)
  onFailed(job: Job) {
    this.logger.log(
      `Failed job ${job.id} of type ${job.name}.\n${job.stacktrace}`,
    );
  }
}
