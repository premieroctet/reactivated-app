import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiModelProperty({
    description: 'Id of the object',
    readOnly: true,
    required: false,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiModelProperty()
  @Column({ length: 25 })
  username: string;

  @ApiModelProperty()
  @Column()
  githubId: string;

  @ApiModelProperty()
  @Column()
  githubToken: string;
}
