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
      for (var i = 0; i < body.repositories_added.length; i++) {
        if (body.repositories_added[i]) {
          const repoAdd = body.repositories_added[i];
          const user = await this.userService.getUser(body.sender.login);
          const newRepo = {
            name: repoAdd.name,
            full_name: repoAdd.full_name,
            githubId: repoAdd.id,
            installationId: body.installation.id,
            user,
          };
          await this.repositoryService.addRepo(newRepo);
          console.log('Repo add :' + newRepo);
        }
      }

      for (var i = 0; i < body.repositories_removed.length; i++) {
        if (body.repositories_removed[i]) {
          const repoDelete = body.repositories_removed[i];
          await this.repositoryService.deleteRepo({ githubId: repoDelete.id });
          console.log('Repo delete :' + repoDelete);
        }
      }
      return {};
    }
  }
}
