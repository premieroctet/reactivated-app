import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectQueue('dependencies') private readonly queue: Queue,
    private readonly repositoryService: RepositoryService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async refreshAllRepositories() {
    const repos = await this.repositoryService.getAllRepos();
    for (const repo of repos) {
      for (const user of repo.users) {
        if (user.githubToken) {
          this.queue.add('compute_yarn_dependencies', {
            repositoryFullName: repo.fullName,
            path: repo.path,
            branch: repo.branch,
            githubToken: user.githubToken,
            repositoryId: repo.githubId,
            hasYarnLock: repo.hasYarnLock,
          });
          break;
        }
      }
    }
  }
}
