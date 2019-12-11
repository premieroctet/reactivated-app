import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

@Entity()
export class Repository {
  @ApiModelProperty({
    description: 'Id of the object',
    readOnly: true,
    required: false,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  fullName: string;

  @ApiModelProperty()
  @Column()
  githubId: string;

  @ApiModelProperty()
  @Column()
  installationId: string;

  @ApiModelProperty()
  @Column()
  author: string;

  @ApiModelProperty()
  @Column()
  repoImg: string;

  @ApiModelProperty()
  @Column()
  createdAt: Date;

  @ApiModelProperty()
  @Column()
  repoUrl: string;

  @ManyToOne(user => User)
  user: User;

  @ApiModelProperty()
  @Column('simple-json', { nullable: true })
  dependencies?: any;

  @ApiModelProperty()
  @Column('simple-json', { nullable: true })
  devDependencies?: any;
}
