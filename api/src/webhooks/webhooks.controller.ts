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
      const user = await this.userService.getUser(body.sender.login);
      body.repositories_added.forEach(async repoAdd => {
        const newRepo = {
          name: repoAdd.name,
          full_name: repoAdd.full_name,
          githubId: repoAdd.id,
          installationId: body.installation.id,
          user,
        };
        await this.repositoryService.addRepo(newRepo);
      });

      body.repositories_removed.forEach(async repoAdd => {
        await this.repositoryService.deleteRepo({ githubId: repoAdd.id });
      });
      return {};
    }
  }
}
