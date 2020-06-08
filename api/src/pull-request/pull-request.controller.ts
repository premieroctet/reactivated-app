import { Controller, Logger, Get } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { PullRequest } from './pull-request.entity';
import { PullRequestService } from './pull-request.service';

@Crud({
  model: { type: PullRequest },

  query: {
    join: {
      repository: {
        eager: true,
      },
    },
  },
})
@Controller('pull-requests')
export class PullRequestController implements CrudController<PullRequest> {
  constructor(public service: PullRequestService) {}
}
