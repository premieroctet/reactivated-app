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
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly userService: UsersService,
    @InjectQueue('dependencies') private readonly queue: Queue,
  ) {}

  @UseInterceptors(WebhookInterceptor)
  @Post('consume')
  async consume(
    @Headers('x-github-event') xGitHubEvent: string,
    @Body() body: any,
  ) {
    if (['installation_repositories', 'installation'].includes(xGitHubEvent)) {
      const user = await this.userService.getUser(body.sender.login);
      let repositories = [];
      let repositoriesRemoved = [];
      if (body.action === 'created') {
        repositories = body.repositories;
      } else if (body.action === 'added') {
        repositories = body.repositories_added;
      } else if (body.action === 'removed') {
        repositoriesRemoved = body.repositories_removed;
      }

      repositories.forEach(async repoAdd => {
        const newRepo = {
          name: repoAdd.name,
          fullName: repoAdd.full_name,
          githubId: repoAdd.id,
          installationId: body.installation.id,
          author: body.installation.account.login,
          repoImg: body.installation.account.avatar_url,
          createdAt: new Date(),
          repoUrl: body.installation.account.html_url,
          user,
        };
        await this.repositoryService.addRepo(newRepo);
        await this.queue.add('compute_yarn_dependencies', {
          repositoryFullName: repoAdd.full_name,
          repositoryId: repoAdd.id,
          githubToken: user.githubToken,
          userId: user.id,
        });
      });

      repositoriesRemoved.forEach(async repoAdd => {
        await this.repositoryService.deleteRepo({ githubId: repoAdd.id });
      });

      if (body.action === 'deleted') {
        await this.repositoryService.deleteRepo({
          installationId: body.installation.id,
        });
      }

      return {};
    }
  }
}
