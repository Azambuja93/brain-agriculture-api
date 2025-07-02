import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Property } from '../../property/entities/property.entity';
  import { Crop } from '../../crop/entities/crop.entity';
  
  @Entity()
  export class Harvest {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    season: string;
  
    @ManyToOne(() => Property, (property) => property.harvests, {
        onDelete: 'CASCADE',
      })
      property: Property;      
  
    @OneToMany(() => Crop, (crop) => crop.harvest, {
      cascade: true,
    })
    crops: Crop[];
  }
  