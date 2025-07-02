import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../property/entities/property.entity';
import { Harvest } from '../harvest/entities/harvest.entity';
import { Crop } from '../crop/entities/crop.entity';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async getSummary() {
    this.logger.log('Iniciando cálculo do resumo do dashboard');

    const [totalFarms, totalHectaresRaw] = await Promise.all([
      this.propertyRepository.count(),
      this.propertyRepository
        .createQueryBuilder('property')
        .select('SUM(property.totalArea)', 'sum')
        .getRawOne()
        .then((res) => Number(res.sum) || 0),
    ]);

    const totalHectares = Number(totalHectaresRaw.toFixed(3));

    this.logger.debug(`Total de fazendas: ${totalFarms}`);
    this.logger.debug(`Total de hectares: ${totalHectares}`);

    return {
      totalFarms,
      totalHectares,
    };
  }

  async getCharts() {
    this.logger.log('Iniciando geração dos gráficos do dashboard');

    const farmsPerState = await this.propertyRepository
      .createQueryBuilder('property')
      .select('property.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .groupBy('property.state')
      .getRawMany();

    const cropsPlanted = await this.cropRepository
      .createQueryBuilder('crop')
      .select('crop.name', 'crop')
      .addSelect('COUNT(*)', 'count')
      .groupBy('crop.name')
      .getRawMany();

    const { agriculturalArea = 0, vegetationArea = 0 } =
      await this.propertyRepository
        .createQueryBuilder('property')
        .select('SUM(property.agriculturalArea)', 'agriculturalArea')
        .addSelect('SUM(property.vegetationArea)', 'vegetationArea')
        .getRawOne();

    this.logger.debug(`Estados com fazendas: ${JSON.stringify(farmsPerState)}`);
    this.logger.debug(`Culturas plantadas: ${JSON.stringify(cropsPlanted)}`);
    this.logger.debug(`Uso do solo: agrícola ${agriculturalArea}, vegetação ${vegetationArea}`);

    return {
      farmsPerState: farmsPerState.map((item) => ({
        state: item.state,
        count: Number(item.count),
      })),
      cropsPlanted: cropsPlanted.map((item) => ({
        crop: item.crop,
        count: Number(item.count),
      })),
      landUse: {
        agriculturalArea: Number(agriculturalArea),
        vegetationArea: Number(vegetationArea),
      },
    };
  }
}
