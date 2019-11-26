import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

@Entity()
export class RepositoryEntity {
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
  full_name: string;

  @ApiModelProperty()
  @Column()
  githubId: string;

  @ApiModelProperty()
  @Column()
  installationId: string;

  @ManyToOne(user => User)
  user: User;
}
