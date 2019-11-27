import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryEntity } from './repository.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RepositoryService extends TypeOrmCrudService<RepositoryEntity> {
  constructor(
    @InjectRepository(RepositoryEntity)
    private repositoryContent: Repository<RepositoryEntity>,
  ) {
    super(repositoryContent);
  }

  async getAllRepositories(): Promise<RepositoryEntity[]> {
    return await this.repositoryContent.find();
  }

  async addRepo(repo: RepositoryEntity): Promise<RepositoryEntity> {
    return await this.repositoryContent.save(repo);
  }

  async deleteRepo(params) {
    return await this.repositoryContent.delete(params);
  }
}
