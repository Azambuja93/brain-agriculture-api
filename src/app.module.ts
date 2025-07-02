// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importe as entidades
import { Property } from './property/entities/property.entity';
import { Harvest } from './harvest/entities/harvest.entity';
import { Crop } from './crop/entities/crop.entity';
import { Producer } from './producer/entities/producer.entity';

import { HarvestController } from './harvest/harvest.controller';
import { HarvestService } from './harvest/harvest.service';
import { ProducerController } from './producer/producer.controller';
import { ProducerService } from './producer/producer.service';
import { CropController } from './crop/crop.controller';
import { CropService } from './crop/crop.service';
import { PropertyController } from './property/property.controller';
import { PropertyService } from './property/property.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Lê o .env automaticamente
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [Producer, Property, Harvest, Crop],
        synchronize: true, // usar apenas em dev
      }),
    }),
    TypeOrmModule.forFeature([Producer, Property, Harvest, Crop]), // se quiser usar repositórios direto no service
  ],
  controllers: [AppController, HarvestController, ProducerController,CropController, PropertyController, DashboardController],
  providers: [AppService, HarvestService, ProducerService, CropService, PropertyService, DashboardService],
})
export class AppModule {}
