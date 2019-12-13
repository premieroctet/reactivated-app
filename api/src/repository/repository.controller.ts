import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RepositoryService } from './repository.service';
import { Crud } from '@nestjsx/crud';
import { Repository } from './repository.entity';
import { ApiTags } from '@nestjs/swagger';

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
@UseGuards(AuthGuard('jwt'))
@ApiTags('repositories')
@Controller(`/users/:userId/repositories`)
export class RepositoryController {
  constructor(public service: RepositoryService) {}
}
