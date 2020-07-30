import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { PullRequest } from '../pull-request/pull-request.entity';

@Injectable()
export class LogService extends TypeOrmCrudService<Log> {
  constructor(
    @InjectRepository(Log)
    private readonly repository: Repository<Log>,
    @InjectRepository(PullRequest)
    private readonly pullRequestRepository: Repository<PullRequest>,
  ) {
    super(repository);
  }

  async savePullRequestLog(logDto: Partial<Log>, branchName: string) {
    const pullRequest = await this.pullRequestRepository.findOneOrFail({
      where: {
        branchName,
      },
    });
    return await this.repository.save({ ...logDto, pullRequest });
  }
}
