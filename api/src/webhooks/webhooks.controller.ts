import {
  Controller,
  Post,
  Body,
  Headers,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { WebhookInterceptor } from './webhooks.interceptor';
import { PullRequestService } from '../pull-request/pull-request.service';
import { DependenciesQueue } from '../queue/dependencies.queue';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly userService: UsersService,
    private readonly pullRequestService: PullRequestService,
    @InjectQueue('dependencies')
    private readonly dependenciesQueue: Queue,
  ) {}

  @UseInterceptors(WebhookInterceptor)
  @Post('consume')
  async consume(
    @Headers('x-github-event') xGitHubEvent: string,
    @Body() body: any,
  ) {
    if (['installation_repositories', 'installation'].includes(xGitHubEvent)) {
      const user = await this.userService.getUser(body.sender.login);

      if (user) {
        let repositories = [];
        let repositoriesRemoved = [];
        if (body.action === 'created') {
          repositories = body.repositories;
        } else if (body.action === 'added') {
          repositories = body.repositories_added;
        } else if (body.action === 'removed') {
          repositoriesRemoved = body.repositories_removed;
        }

        await Promise.all(
          repositories.map((repoAdd) => {
            const newRepo = {
              name: repoAdd.name,
              fullName: repoAdd.full_name,
              githubId: repoAdd.id,
              installationId: body.installation.id,
              author: body.installation.account.login,
              repoImg: body.installation.account.avatar_url,
              createdAt: new Date(),
              repoUrl: body.installation.account.html_url,
              users: [user],
            };

            return this.repositoryService.addRepo(newRepo);
          }),
        );

        await Promise.all(
          repositoriesRemoved.map((repoAdd) => {
            return this.repositoryService.deleteRepo(
              {
                githubId: repoAdd.id,
              },
              user.id,
            );
          }),
        );

        if (body.action === 'deleted') {
          await this.repositoryService.deleteRepo(
            {
              installationId: body.installation.id,
            },
            user.id,
          );
        }
      }

      return {};
    }

    // https://developer.github.com/webhooks/event-payloads/#pull_request
    if (xGitHubEvent === 'pull_request') {
      const branchName = body.pull_request.head.ref;
      const repoId = body.repository.id;

      try {
        switch (body.action) {
          case 'reopened':
          case 'opened':
            const url = body.pull_request.html_url;

            return await this.pullRequestService.updatePullRequest(branchName, {
              status: 'done',
              url,
            });
          case 'closed':
            if (body.pull_request.merged === true) {
              const repository = await this.repositoryService.findRepo({
                githubId: repoId.toString(),
              });
              await this.dependenciesQueue.add('compute_yarn_dependencies', {
                repositoryFullName: repository.fullName,
                repositoryId: repository.githubId,
                githubToken: repository.users[0].githubToken,
                branch: repository.branch,
                path: repository.path,
                hasYarnLock: true, // only yarn.lock supported
              });

              this.logger.log('Pull request merged : ' + branchName);
              return await this.pullRequestService.updatePullRequest(
                branchName,
                {
                  status: 'merged',
                },
              );
            } else {
              return await this.pullRequestService.updatePullRequest(
                branchName,
                {
                  status: 'closed',
                },
              );
            }

          default:
            return {};
        }
      } catch (error) {
        this.logger.error('Error Pull Request webhook : ' + error);
      }
    }
  }
}
