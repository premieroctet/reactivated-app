import { Module } from '@nestjs/common';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
