import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Repository {
  @ApiProperty({
    description: 'Id of the object',
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({
    description: 'Name of the repo',
    readOnly: true,
  })
  @Column()
  name: string;

  @ApiProperty({
    readOnly: true,
  })
  @Column()
  fullName: string;

  @ApiProperty({
    readOnly: true,
  })
  @Column()
  githubId: string;

  @ApiProperty({
    readOnly: true,
  })
  @Column('text', { nullable: true })
  installationId?: string;

  @ApiProperty({
    description: 'Author of the repo',
    readOnly: true,
  })
  @Column()
  author: string;

  @ApiProperty({
    description: 'Image of the repo',
    readOnly: true,
  })
  @Column()
  repoImg: string;

  @ApiProperty({
    description: 'Create date of the repo',
    readOnly: true,
  })
  @Column()
  createdAt: Date;

  @ApiProperty()
  @Column('datetime', { nullable: true })
  dependenciesUpdatedAt?: Date;

  @ApiProperty({
    description: 'URL of the repo',
    readOnly: true,
  })
  @Column()
  repoUrl: string;

  @ApiProperty()
  @ManyToMany(
    user => User,
    user => user.id,
  )
  @JoinTable()
  users?: User[];

  @ApiProperty({
    description: 'Dependencies of the repo',
    readOnly: true,
  })
  @Column('simple-json', { nullable: true })
  dependencies?: any;

  @ApiProperty()
  @Column({
    default: 'master',
  })
  branch?: string;

  @ApiProperty()
  @Column({
    default: '/',
  })
  path?: string;

  @ApiProperty()
  @Column({ default: false })
  isConfigured?: boolean;
}
