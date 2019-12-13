import { BullQueueEvents, OnQueueEvent, Processor, Process } from 'nest-bull';
import { Job } from 'bull';
import { Logger, HttpService } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';

const { exec } = require('child_process');
const fs = require('fs');

@Processor({ name: 'dependencies' })
export class DependenciesQueue {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private repositoriesService: RepositoryService,
    private readonly httpService: HttpService,
  ) {}

  @Process({ name: 'compute_yarn_dependencies' })
  async computeYarnDependencies(job: Job) {
    const responsePackageJson = await this.httpService
      .get(
        `https://api.github.com/repos/${job.data.repositoryFullName}/contents/package.json`,
        {
          headers: {
            Authorization: `token ${job.data.githubToken}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        },
      )
      .toPromise();

    const responseYarnLock = await this.httpService
      .get(
        `https://api.github.com/repos/${job.data.repositoryFullName}/contents/yarn.lock`,
        {
          headers: {
            Authorization: `token ${job.data.githubToken}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
          },
        },
      )
      .toPromise();

    const path = `tmp/${job.data.repositoryId}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const bufferPackage = Buffer.from(
      responsePackageJson.data.content,
      'base64',
    );

    fs.writeFile(`${path}/package.json`, bufferPackage.toString('utf-8'));
    const bufferLock = Buffer.from(responseYarnLock.data.content, 'base64');

    fs.writeFile(`${path}/yarn.lock`, bufferLock.toString('utf-8'));

    const repository = await this.repositoriesService.findOne({
      githubId: job.data.repositoryId,
      user: job.data.userId,
    });

    exec(`cd ${path} && yarn outdated --json`, async (err, stdout, stderr) => {
      const manifest = JSON.parse(stdout.split('\n')[1]);
      repository.dependencies = { deps: manifest.data.body };
      await this.repositoriesService.addRepo(repository);
    });
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
