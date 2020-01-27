import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import {
  Repository as RepositoryContent,
  ObjectLiteral,
  DeleteResult,
} from 'typeorm';

@Injectable()
export class RepositoryService extends TypeOrmCrudService<Repository> {
  constructor(
    @InjectRepository(Repository)
    private repositoryContent: RepositoryContent<Repository>,
  ) {
    super(repositoryContent);
  }

  async findRepo(repoId: string | ObjectLiteral) {
    return this.repositoryContent.findOne({
      where:
        typeof repoId === 'string'
          ? {
              id: repoId,
            }
          : repoId,
      relations: ['users'],
    });
  }

  async addRepo(repo: Repository): Promise<Repository> {
    return this.repositoryContent.save(repo);
  }

  async updateRepo(repoId: string, repo: Repository) {
    const repository = await this.findRepo(repoId);

    let users = repository.users;

    if (
      repo.users &&
      users &&
      !users.some(repoUser => repo.users.some(user => user.id === repoUser.id))
    ) {
      users = [...repository.users, ...(repo.users || [])];
    }

    return this.repositoryContent.save({
      ...repository,
      ...repo,
      users,
    });
  }

  async deleteRepo(params, userId: number) {
    const repos = await this.find({
      where: params,
      relations: ['users'],
    });

    return Promise.all(
      repos.map(
        (repo): Promise<DeleteResult | Repository | void> => {
          const users = repo.users;

          if (users.some(user => user.id === userId)) {
            if (users.length === 1) {
              return this.repositoryContent.delete(repo.id);
            } else {
              return this.repositoryContent.save({
                ...repo,
                users: users.filter(user => user.id !== userId),
              });
            }
          }

          return Promise.resolve();
        },
      ),
    );
  }
}
