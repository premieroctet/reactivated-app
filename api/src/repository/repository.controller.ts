import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
}
