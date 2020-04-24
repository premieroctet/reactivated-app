import {
  Controller,
  UseGuards,
  Put,
  Body,
  Param,
  Request,
  Get,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RepositoryService } from './repository.service';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  CrudAuth,
} from '@nestjsx/crud';
import { Repository } from './repository.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
import { GithubService } from '../github/github.service';
import { UsersService } from '../users/users.service';

@Crud({
  model: {
    type: Repository,
  },
  query: {
    join: {
      users: {
        eager: true,
        required: true,
      },
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: user => {
    return {
      userId: { $eq: user.id },
    };
  },
})
@UseGuards(AuthGuard('jwt'))
@ApiTags('repositories')
@Controller(`/repositories`)
export class RepositoryController implements CrudController<Repository> {
  constructor(
    public service: RepositoryService,
    private readonly githubService: GithubService,
    private readonly usersService: UsersService,
    @InjectQueue('dependencies') private readonly queue: Queue,
  ) {}

  get base(): CrudController<Repository> {
    return this;
  }

  @ApiOperation({
    summary: 'Configure a repository branch and main path',
    description: 'Also checks for package.json & yarn.lock existence',
  })
  @Put(':id/configure')
  async configureRepository(
    @Body() repo: Repository,
    @Param('id') repoId: string,
    @Request() req,
  ) {
    try {
      await Promise.all([
        this.githubService.getPackageJson({
          branch: repo.branch,
          name: repo.fullName,
          path: repo.path,
          token: req.user.githubToken,
        }),
        this.githubService.getYarnLock({
          branch: repo.branch,
          name: repo.fullName,
          path: repo.path,
          token: req.user.githubToken,
        }),
      ]);
    } catch (e) {
      throw new NotFoundException();
    }

    const userId = req.user.id;
    const user = await this.usersService.getById(userId);
    const repository = await this.service.updateRepo(repoId, {
      ...repo,
      isConfigured: true,
      dependenciesUpdatedAt: new Date(),
      users: [user],
    });

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

  @ApiOperation({
    summary: 'Triggers repository deps computation in a queue',
  })
  @Get(':id/compute_deps')
  async computeDependencies(@Param('id') repoId: string, @Request() req) {
    const userId = req.user.id;
    const repository = await this.service.findRepo({
      id: parseInt(repoId, 10),
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

  @Override('getOneBase')
  async getRepository(@ParsedRequest() req: CrudRequest) {
    const data = await this.base.getOneBase(req);

    if (!data.isConfigured) {
      throw new ForbiddenException();
    }

    return data;
  }

  @ApiOperation({
    summary: 'Sync a repository from user GitHub account',
  })
  @Get('sync/:author/:name')
  async resyncRepo(
    @Param('author') author: string,
    @Param('name') name: string,
    @Request() req,
  ) {
    const { user } = req;

    const response = await this.githubService.getRepository({
      fullName: `${author}/${name}`,
      token: user.githubToken,
    });
    const { data } = response;

    const repository: Repository = {
      name: data.name,
      fullName: data.full_name,
      githubId: data.id,
      installationId: null,
      author: data.owner.login,
      repoImg: data.owner.avatar_url,
      createdAt: new Date(),
      repoUrl: data.html_url,
      users: [user],
    };

    const createdRepository = await this.service.addRepo(repository);

    return createdRepository;
  }
}
