import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PullRequest, Status } from './pull-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PullRequestService extends TypeOrmCrudService<PullRequest> {
  constructor(
    @InjectRepository(PullRequest)
    private readonly repository: Repository<PullRequest>,
  ) {
    super(repository);
  }

  async createPullRequest(pullRequest: PullRequest): Promise<PullRequest> {
    return this.repository.save(pullRequest);
  }

  async updatePullRequest(
    branchName: string,
    data: Pick<PullRequest, 'status' | 'url'>,
  ) {
    const pullRequest = await this.repository.findOneOrFail({
      where: {
        branchName,
      },
    });
    return await this.repository.save({ ...pullRequest, ...data });
  }
}
