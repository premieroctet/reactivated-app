import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import {
  Repository as RepositoryContent,
  DeleteResult,
  RemoveOptions,
} from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class RepositoryService extends TypeOrmCrudService<Repository> {
  constructor(
    @InjectRepository(Repository)
    private repositoryContent: RepositoryContent<Repository>,
  ) {
    super(repositoryContent);
  }

  async getAllRepos() {
    return this.repositoryContent.find({ relations: ['users'] });
  }

  async removeRepos(repos: Repository[], options?: RemoveOptions) {
    return this.repositoryContent.remove(repos, options);
  }

  async findRepos(criteria: Partial<Repository>) {
    return this.repositoryContent.find({
      where: criteria,
      relations: ['users'],
    });
  }

  async findRepo(criteria: Partial<Repository>) {
    return this.repositoryContent.findOne({
      where: criteria,
      relations: ['users'],
    });
  }

  async addRepo(repo: Repository): Promise<Repository> {
    return this.repositoryContent.save(repo);
  }

  async updateRepo(repoId: string, repo: Repository) {
    const repository = await this.findRepo({ id: parseInt(repoId, 10) });
    let users = repository.users;

    /*
     * Search if the users passed in repo exists in the repository found in db
     * If it doesnt exist, adds the user to the repository
     */
    if (
      repo.users &&
      users &&
      users.some(repoUser => repo.users.some(user => user.id === repoUser.id))
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
