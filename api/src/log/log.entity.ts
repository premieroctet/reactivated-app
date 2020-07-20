import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PullRequest } from '../pull-request/pull-request.entity';

@Entity()
export class Log {
  @ApiProperty({
    description: 'Id of the object',
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ length: 500, nullable: true })
  stackTrace?: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  failedReason: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  data?: object;

  @OneToOne(
    type => PullRequest,
    pullRequest => pullRequest.log,
    { onDelete: 'CASCADE' },
  )
  pullRequest: PullRequest;
}
