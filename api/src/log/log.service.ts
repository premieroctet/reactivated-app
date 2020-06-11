import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogService extends TypeOrmCrudService<Log> {
  constructor(
    @InjectRepository(Log)
    private readonly repository: Repository<Log>,
  ) {
    super(repository);
  }

  async saveLog(logDto: Log) {
    return await this.repository.save({ ...logDto });
  }
}
