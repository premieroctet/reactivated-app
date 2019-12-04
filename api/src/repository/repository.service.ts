import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from './repository.entity';
import { Repository as RepositoryContent } from 'typeorm';

@Injectable()
export class RepositoryService extends TypeOrmCrudService<Repository> {
  constructor(
    @InjectRepository(Repository)
    private repositoryContent: RepositoryContent<Repository>,
  ) {
    super(repositoryContent);
  }

  async getAllRepositories(): Promise<Repository[]> {
    return await this.repositoryContent.find();
  }

  async addRepo(repo: Repository): Promise<Repository> {
    return await this.repositoryContent.save(repo);
  }

  async deleteRepo(params) {
    return await this.repositoryContent.delete(params);
  }
}
