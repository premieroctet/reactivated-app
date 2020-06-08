import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { PullRequest } from './pull-request.entity';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class PullRequestService extends TypeOrmCrudService<PullRequest> {
  constructor(
    @InjectRepository(PullRequest)
    private readonly repository: Repository<PullRequest>,
    private readonly repoService: RepositoryService,
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

  async getPullRequestsFromRepository(repositoryId, limit?) {
    const repo = await this.repoService.findRepo({ id: repositoryId });

    if (!repo) {
      throw new NotFoundException('Repository not found');
    }

    return await this.repository.find({
      where: { repositoryId: repo.id },
      relations: ['repository'],
      order: { id: 'DESC' },
      take: limit,
    });
  }
}
