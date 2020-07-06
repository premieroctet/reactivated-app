import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Log {
  @ApiProperty({
    description: 'Id of the object',
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ length: 500 })
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
}
