import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Log } from '../log/log.entity';
import { Repository } from '../repository/repository.entity';

export type Status = 'pending' | 'done' | 'merged' | 'closed' | 'error';

@Entity()
export class PullRequest {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Id of the object',
    readOnly: true,
  })
  id: number;

  @ApiProperty()
  @Column()
  status: Status;

  @ApiProperty()
  @ManyToOne(
    () => Repository,
    repository => repository.pullRequests,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'repositoryId' })
  repository: Repository;

  @ApiProperty()
  @Column({ unique: true })
  branchName: string;

  @ApiProperty()
  @Column({ nullable: true })
  url: string;

  @OneToOne(
    type => Log,
    log => log.pullRequest,
    { onUpdate: 'CASCADE' },
  )
  @JoinColumn()
  log: Log;
}
