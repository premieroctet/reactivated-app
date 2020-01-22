import {
  Controller,
  UseGuards,
  Put,
  Body,
  Param,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RepositoryService } from './repository.service';
import { Crud } from '@nestjsx/crud';
import { Repository } from './repository.entity';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';

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
  constructor(
    public service: RepositoryService,
    @InjectQueue('dependencies') private readonly queue: Queue,
  ) {}

  @Put(':id/configure')
  async configureRepository(
    @Body() repo: Repository,
    @Param('userId') userId: number,
    @Param('id') repoId: number,
    @Request() req,
  ) {
    const repository = await this.service.updateRepo(userId, repoId, repo);

    await this.queue.add('compute_yarn_dependencies', {
      repositoryFullName: repository.fullName,
      repositoryId: repository.githubId,
      githubToken: req.user.githubToken,
      userId,
      branch: repository.branch,
      path: repository.path,
    });

    return repository;
  }

  @Get(':id/compute_deps')
  async computeDependencies(
    @Param('userId') userId: number,
    @Param('id') repoId: number,
    @Request() req,
  ) {
    const repository = await this.service.findOne(repoId, {
      where: {
        user: { id: userId },
      },
    });

    await this.queue.add('compute_yarn_dependencies', {
      repositoryFullName: repository.fullName,
      repositoryId: repository.githubId,
      githubToken: req.user.githubToken,
      userId,
      branch: repository.branch,
      path: repository.path,
    });
  }
}
