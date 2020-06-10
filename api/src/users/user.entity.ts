import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'Id of the object',
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ length: 25 })
  username: string;

  @ApiProperty({ readOnly: true })
  @Column()
  githubId: string;

  @ApiProperty()
  @Column()
  githubToken: string;

  @ApiProperty()
  @Column({ default: false })
  validated: false;
}
