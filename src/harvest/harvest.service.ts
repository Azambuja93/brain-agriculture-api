import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Harvest } from './entities/harvest.entity';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { Property } from '../property/entities/property.entity';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

@Injectable()
export class HarvestService {
  private readonly logger = new Logger(HarvestService.name);

  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    const { season, propertyId, crops } = createHarvestDto;

    this.logger.log(`Criando safra para propriedade ${propertyId}`);

    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      this.logger.warn(`Propriedade não encontrada: ${propertyId}`);
      throw new NotFoundException('Propriedade não encontrada');
    }

    const harvest = this.harvestRepository.create({
      season,
      property,
      crops,
    });

    const saved = await this.harvestRepository.save(harvest);
    this.logger.log(`Safra criada com ID ${saved.id}`);

    return this.harvestRepository.findOne({
      where: { id: saved.id },
      relations: ['property', 'crops'],
    });
  }

  async findAll(): Promise<Harvest[]> {
    this.logger.log('Listando todas as safras');
    return this.harvestRepository.find({
      relations: ['property', 'crops'],
    });
  }

  async findOne(id: string): Promise<Harvest | null> {
    this.logger.log(`Buscando safra com id ${id}`);
    return this.harvestRepository.findOne({
      where: { id },
      relations: ['property', 'crops'],
    });
  }

  async update(id: string, dto: UpdateHarvestDto): Promise<Harvest | null> {
    this.logger.log(`Atualizando safra com id ${id}`);
    const harvest = await this.harvestRepository.findOne({
      where: { id },
      relations: ['crops', 'property'],
    });

    if (!harvest) {
      this.logger.warn(`Safra não encontrada para atualização: ${id}`);
      return null;
    }

    Object.assign(harvest, dto);
    const updated = await this.harvestRepository.save(harvest);
    this.logger.log(`Safra atualizada com sucesso: ${updated.id}`);
    return updated;
  }

  async remove(id: string): Promise<Harvest | null> {
    this.logger.log(`Removendo safra com id ${id}`);
    const harvest = await this.harvestRepository.findOne({ where: { id } });

    if (!harvest) {
      this.logger.warn(`Safra não encontrada para remoção: ${id}`);
      return null;
    }

    await this.harvestRepository.remove(harvest);
    this.logger.log(`Safra removida com sucesso: ${id}`);
    return harvest;
  }
}
