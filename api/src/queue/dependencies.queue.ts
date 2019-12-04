import { BullQueueEvents, OnQueueEvent, Processor, Process } from 'nest-bull';
import { Job } from 'bull';
import { Logger, HttpService } from '@nestjs/common';
import * as david from 'david';
import { RepositoryService } from '../repository/repository.service';

@Processor({ name: 'dependencies' })
export class DependenciesQueue {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private repositoriesService: RepositoryService,
    private readonly httpService: HttpService,
  ) {}

  @Process({ name: 'compute_dependencies' })
  async computeDependencies(job: Job) {
    const response = await this.httpService
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

    const buffer = Buffer.from(response.data.content, 'base64');
    const manifest = JSON.parse(buffer.toString('utf-8'));

    const repository = await this.repositoriesService.findOne({
      githubId: job.data.repositoryId,
      user: job.data.userId,
    });

    david.getDependencies(manifest, async (er, deps) => {
      repository.dependencies = deps;

      david.getDependencies(manifest, { dev: true }, async (er, devDeps) => {
        repository.devDependencies = devDeps;

        await this.repositoriesService.addRepo(repository);
      });
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
