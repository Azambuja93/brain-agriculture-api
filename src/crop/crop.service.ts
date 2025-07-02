import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';
import { Harvest } from '../harvest/entities/harvest.entity';

@Injectable()
export class CropService {
  private readonly logger = new Logger(CropService.name);

  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,

    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
  ) {}

  async create(data: CreateCropDto): Promise<Crop> {
    this.logger.log(`Iniciando criação de cultura: ${data.name}`);
    const harvest = await this.harvestRepository.findOne({
      where: { id: data.harvestId },
    });

    if (!harvest) {
      this.logger.warn(`Safra não encontrada. ID: ${data.harvestId}`);
      throw new NotFoundException('Harvest not found');
    }

    const crop = this.cropRepository.create({
      name: data.name,
      harvest,
    });

    const saved = await this.cropRepository.save(crop);
    this.logger.log(`Cultura criada com sucesso. ID: ${saved.id}`);
    return saved;
  }

  async findAll(): Promise<Crop[]> {
    this.logger.log('Buscando todas as culturas cadastradas');
    return this.cropRepository.find({
      relations: ['harvest'],
    });
  }

  async findOne(id: string): Promise<Crop | null> {
    this.logger.log(`Buscando cultura com ID: ${id}`);
    return this.cropRepository.findOne({
      where: { id },
      relations: ['harvest'],
    });
  }

  async update(id: string, dto: UpdateCropDto): Promise<Crop | null> {
    this.logger.log(`Atualizando cultura ID: ${id}`);
    const crop = await this.cropRepository.findOne({ where: { id } });
    if (!crop) {
      this.logger.warn(`Cultura não encontrada para atualização. ID: ${id}`);
      return null;
    }

    Object.assign(crop, dto);
    const updated = await this.cropRepository.save(crop);
    this.logger.log(`Cultura atualizada com sucesso. ID: ${updated.id}`);
    return updated;
  }

  async remove(id: string): Promise<Crop | null> {
    this.logger.log(`Removendo cultura ID: ${id}`);
    const crop = await this.cropRepository.findOne({ where: { id } });
    if (!crop) {
      this.logger.warn(`Cultura não encontrada para remoção. ID: ${id}`);
      return null;
    }

    await this.cropRepository.remove(crop);
    this.logger.log(`Cultura removida com sucesso. ID: ${id}`);
    return crop;
  }
}
