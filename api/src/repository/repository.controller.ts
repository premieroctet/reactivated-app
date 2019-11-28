import { Controller, Get, Request } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { Crud } from '@nestjsx/crud';
import { RepositoryEntity } from './repository.entity';

@Crud({
  model: {
    type: RepositoryEntity,
  },
})
@Controller('repos')
export class RepositoryController {
  constructor(public service: RepositoryService) {}

  @Get('/repo')
  async loadRepoList(@Request() req) {
    const repoList = await this.service.getAllRepositories();
    return { repoList };
  }
}
