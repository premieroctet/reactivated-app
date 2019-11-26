import { Controller, Post, Body, Headers } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { UsersService } from '../users/users.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly userService: UsersService,
  ) {}

  @Post('consume')
  async consume(
    @Headers('x-github-event') xGitHubEvent: string,
    @Body() body: any,
  ) {
    if (['installation_repositories', 'installation'].includes(xGitHubEvent)) {
      if (body.repositories_added[0]) {
        const repoAdd = body.repositories_added[0];
        const user = await this.userService.getUser(body.sender.login);
        const newRepo = {
          name: repoAdd.name,
          full_name: repoAdd.full_name,
          githubId: repoAdd.id,
          installationId: body.installation.id,
          user,
        };
        await this.repositoryService.addRepo(newRepo);
      }
      if (body.repositories_removed[0]) {
        const repoDelete = body.repositories_removed[0];
        await this.repositoryService.deleteRepo({ githubId: repoDelete.id });
      }
      return {};
    }
  }
}
