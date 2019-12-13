import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @Column()
  name: string;

  @Column()
  fullName: string;

  @Column()
  githubId: string;

  @Column()
  installationId: string;

  @Column()
  author: string;

  @Column()
  repoImg: string;

  @Column()
  createdAt: Date;

  @Column()
  repoUrl: string;

  @ManyToOne(user => User)
  user: User;

  @Column('simple-json', { nullable: true })
  dependencies?: any;
}
