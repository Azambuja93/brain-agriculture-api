import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Property } from './entities/property.entity';
  import { CreatePropertyDto } from './dto/create-property.dto';
  import { Producer } from '../producer/entities/producer.entity';
  import { UpdatePropertyDto } from './dto/update-property.dto';
  
  @Injectable()
  export class PropertyService {
    private readonly logger = new Logger(PropertyService.name);
  
    constructor(
      @InjectRepository(Property)
      private propertyRepository: Repository<Property>,
      @InjectRepository(Producer)
      private producerRepository: Repository<Producer>,
    ) {}
  
    async create(data: CreatePropertyDto): Promise<Property> {
      this.logger.log(`Criando propriedade para produtor ${data.producerId}`);
  
      const { agriculturalArea, vegetationArea, totalArea, producerId } = data;
  
      if (agriculturalArea + vegetationArea > totalArea) {
        this.logger.warn(
          `Área inválida: agric.(${agriculturalArea}) + veg.(${vegetationArea}) > total(${totalArea})`,
        );
        throw new BadRequestException(
          'Soma de áreas não pode ultrapassar a área total.',
        );
      }
  
      const producer = await this.producerRepository.findOne({
        where: { id: producerId },
      });
  
      if (!producer) {
        this.logger.warn(`Produtor não encontrado com ID: ${producerId}`);
        throw new NotFoundException('Produtor não encontrado.');
      }
  
      const property = this.propertyRepository.create({
        ...data,
        producer,
      });
  
      const saved = await this.propertyRepository.save(property);
      this.logger.log(`Propriedade criada com ID: ${saved.id}`);
  
      return saved;
    }
  
    async findAll(): Promise<Property[]> {
      this.logger.log('Buscando todas as propriedades');
      return this.propertyRepository.find({
        relations: ['producer'],
      });
    }
  
    async findOne(id: string): Promise<Property> {
      this.logger.log(`Buscando propriedade com ID: ${id}`);
  
      const property = await this.propertyRepository.findOne({
        where: { id },
        relations: ['producer', 'harvests', 'harvests.crops'],
      });
  
      if (!property) {
        this.logger.warn(`Propriedade não encontrada com ID: ${id}`);
        throw new NotFoundException('Fazenda não encontrada');
      }
  
      return property;
    }
  
    async remove(id: string): Promise<void> {
      this.logger.log(`Removendo propriedade com ID: ${id}`);
  
      const property = await this.propertyRepository.findOne({ where: { id } });
  
      if (!property) {
        this.logger.warn(`Propriedade não encontrada para remoção: ${id}`);
        throw new NotFoundException('Fazenda não encontrada');
      }
  
      await this.propertyRepository.remove(property);
      this.logger.log(`Propriedade removida com sucesso: ${id}`);
    }
  
    async update(id: string, dto: UpdatePropertyDto): Promise<Property> {
      this.logger.log(`Atualizando propriedade com ID: ${id}`);
  
      const property = await this.propertyRepository.findOne({ where: { id } });
  
      if (!property) {
        this.logger.warn(`Propriedade não encontrada para atualização: ${id}`);
        throw new NotFoundException('Fazenda não encontrada');
      }
  
      const agri = dto.agriculturalArea ?? property.agriculturalArea;
      const vege = dto.vegetationArea ?? property.vegetationArea;
      const total = dto.totalArea ?? property.totalArea;
  
      if (agri + vege > total) {
        this.logger.warn(
          `Área inválida ao atualizar: agric.(${agri}) + veg.(${vege}) > total(${total})`,
        );
        throw new BadRequestException(
          'Soma de áreas não pode ultrapassar a área total.',
        );
      }
  
      Object.assign(property, dto);
      const updated = await this.propertyRepository.save(property);
  
      this.logger.log(`Propriedade atualizada com sucesso: ${id}`);
      return updated;
    }
  }
  