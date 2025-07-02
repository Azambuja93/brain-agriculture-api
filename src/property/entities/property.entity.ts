import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Producer } from '../../producer/entities/producer.entity';
  import { Harvest } from '../../harvest/entities/harvest.entity';
  
  @Entity()
  export class Property {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    city: string;
  
    @Column()
    state: string;
  
    @Column('float')
    totalArea: number;
  
    @Column('float')
    agriculturalArea: number;
  
    @Column('float')
    vegetationArea: number;
  
    @ManyToOne(() => Producer, producer => producer.properties, {
        onDelete: 'CASCADE',
      })
      producer: Producer;
  
    @OneToMany(() => Harvest, (harvest) => harvest.property, {
      cascade: true,
    })
    harvests: Harvest[];
  }
  