import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RepositoryService } from './repository.service';
import { Crud } from '@nestjsx/crud';
import { Repository } from './repository.entity';
import { ApiUseTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Repository,
  },
  params: {
    userId: {
      field: 'user',
      type: 'number',
    },
  },
})
/*@Controller('repos')
export class RepositoryController {
  constructor(public service: RepositoryService) {}

  @Get('/repo')
  async loadRepoList(@Request() req) {
    const repoList = await this.service.getAllRepositories();
    return { repoList };
  }
}*/

@UseGuards(AuthGuard('jwt'))
@ApiUseTags('repositories')
@Controller(`/users/:userId/repositories`)
export class RepositoryController {
  constructor(public service: RepositoryService) {}
}
