import {
  Controller,
  Post,
  Body,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { WebhookInterceptor } from './webhooks.interceptor';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly userService: UsersService,
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

            return this.repositoryService.addRepo(newRepo);
          }),
        );

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
  }
}
