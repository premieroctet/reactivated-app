import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
import { GithubService } from '../github/github.service';
import { PullRequest } from '../pull-request/pull-request.entity';
import { PullRequestService } from '../pull-request/pull-request.service';
import { UsersService } from '../users/users.service';
import { Repository } from './repository.entity';
import { RepositoryService } from './repository.service';
import { User } from '../users/user.entity';

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
  filter: (user: User) => ({
    'users.id': {
      $in: [user.id],
    },
  }),
})
@UseGuards(AuthGuard('jwt'))
@ApiTags('repositories')
@Controller(`/repositories`)
export class RepositoryController implements CrudController<Repository> {
  private readonly logger = new Logger(RepositoryController.name);
  constructor(
    public service: RepositoryService,
    private readonly githubService: GithubService,
    private readonly usersService: UsersService,
    private readonly pullRequestService: PullRequestService,
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
    let hasYarnLock = true;

    try {
      await this.githubService.getFile({
        branch: repo.branch,
        name: repo.fullName,
        path: repo.path,
        token: req.user.githubToken,
        fileName: 'package.json',
      });

      try {
        await this.githubService.getFile({
          branch: repo.branch,
          name: repo.fullName,
          path: repo.path,
          token: req.user.githubToken,
          fileName: 'yarn.lock',
        });
      } catch (error) {
        hasYarnLock = false;
        await this.githubService.getFile({
          branch: repo.branch,
          name: repo.fullName,
          path: repo.path,
          token: req.user.githubToken,
          fileName: 'package-lock.json',
        });
      }
    } catch (e) {
      throw new NotFoundException();
    }

    const userId = req.user.id;
    const user = await this.usersService.getById(userId);
    const repository = await this.service.updateRepo(repoId, {
      ...repo,
      hasYarnLock,
      users: [user],
    });

    await this.queue.add('compute_yarn_dependencies', {
      repositoryFullName: repository.fullName,
      repositoryId: repository.githubId,
      githubToken: req.user.githubToken,
      branch: repository.branch,
      path: repository.path,
      hasYarnLock,
    });

    return repository;
  }

  @ApiOperation({
    summary: 'Triggers repository deps computation in a queue',
  })
  @Get(':id/compute_deps')
  async computeDependencies(@Param('id') repoId: string, @Request() req) {
    const repository = await this.service.findRepo({
      id: parseInt(repoId, 10),
    });

    await this.queue.add('compute_yarn_dependencies', {
      repositoryFullName: repository.fullName,
      repositoryId: repository.githubId,
      githubToken: req.user.githubToken,
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

  @Post(':author/:name/pulls')
  async createUpgradePullRequest(
    @Param('author') author: string,
    @Param('name') name: string,
    @Request() req,
    @Body()
    repoInfo: {
      updatedDependencies: string[];
      repoId: string;
    },
  ) {
    const { githubToken } = req.user;
    const fullName = `${author}/${name}`;

    const repository = await this.service.findRepo({
      id: parseInt(repoInfo.repoId, 10),
    });

    const branchTimestamp = new Date().getTime().toString();
    const branchName = `reactivatedapp/${branchTimestamp}`;

    const pullRequest = new PullRequest();
    pullRequest.repository = repository;
    pullRequest.status = 'pending';
    pullRequest.branchName = branchName;
    await this.pullRequestService.createPullRequest(pullRequest);

    this.queue.add('upgrade_dependencies', {
      repositoryFullName: fullName,
      repositoryId: repository.githubId,
      githubToken,
      branch: repository.branch,
      path: repository.path,
      updatedDependencies: repoInfo.updatedDependencies,
      hasYarnLock: repository.hasYarnLock,
      branchName,
    });
  }

  @Get(':id/pull-requests')
  async getPullRequests(@Param('id') repoId: string, @Query() query) {
    return await this.pullRequestService.getPullRequestsFromRepository(
      repoId,
      query.limit,
    );
  }
}
