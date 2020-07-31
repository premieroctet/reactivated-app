import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { PullRequestService } from '../pull-request/pull-request.service';
import { RepositoryService } from '../repository/repository.service';
import { UsersService } from '../users/users.service';
import { WebhookInterceptor } from './webhooks.interceptor';

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
        const repos = await this.repositoryService.getAllRepos();
        const nbRepos = repos.filter(repo =>
          repo.users.some(repoUser => repoUser.id === user.id),
        ).length;
        let repositories = [];
        let repositoriesRemoved = [];
        let nbNewRepo = 0;

        if (body.action === 'created') {
          repositories = body.repositories;
        } else if (body.action === 'added') {
          repositories = body.repositories_added;
        } else if (body.action === 'removed') {
          repositoriesRemoved = body.repositories_removed;
        }

        /*await Promise.all(
          repositories.map(repoAdd => {
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
            nbNewRepo++;
            if (
              nbNewRepo + nbRepos <=
              Number(this.configService.get('MAX_REPOS'))
            ) {
              return this.repositoryService.addRepo(newRepo);
            }
          }),
        );*/

        await Promise.all(
          repositoriesRemoved.map(repoAdd => {
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

              if (repository.hasYarnLock === false) {
                repository.hasYarnLock = true;
                await this.repositoryService.updateRepo(
                  repository.id.toString(),
                  repository,
                );
              }

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
