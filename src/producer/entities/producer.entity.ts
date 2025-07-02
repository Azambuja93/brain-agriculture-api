// src/producer/entities/producer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Property } from '../../property/entities/property.entity';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  document: string;

  @Column()
  name: string;

  @OneToMany(() => Property, property => property.producer, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  properties: Property[];
}
