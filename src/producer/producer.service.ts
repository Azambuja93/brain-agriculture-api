import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(dto: CreateProducerDto): Promise<Producer> {
    this.logger.log(`Criando produtor com documento: ${dto.document}`);
    const producer = this.producerRepository.create(dto);
    const savedProducer = await this.producerRepository.save(producer);

    this.logger.debug(`Produtor salvo com ID: ${savedProducer.id}`);
    return this.producerRepository.findOne({
      where: { id: savedProducer.id },
      relations: ['properties'],
    });
  }

  async findAll(): Promise<Producer[]> {
    this.logger.log('Buscando todos os produtores');
    return this.producerRepository.find({ relations: ['properties'] });
  }

  async findOne(id: string): Promise<Producer> {
    this.logger.log(`Buscando produtor com ID: ${id}`);
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['properties'],
    });

    if (!producer) {
      this.logger.warn(`Produtor não encontrado: ${id}`);
      throw new NotFoundException('Produtor não encontrado');
    }

    return producer;
  }

  async update(id: string, updateDto: UpdateProducerDto): Promise<Producer> {
    this.logger.log(`Atualizando produtor com ID: ${id}`);
    const producer = await this.producerRepository.findOne({ where: { id } });

    if (!producer) {
      this.logger.warn(`Produtor não encontrado para atualização: ${id}`);
      throw new NotFoundException('Produtor não encontrado');
    }

    Object.assign(producer, updateDto);
    const updated = await this.producerRepository.save(producer);
    this.logger.debug(`Produtor atualizado com sucesso: ${updated.id}`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo produtor com ID: ${id}`);
    const producer = await this.producerRepository.findOne({ where: { id } });

    if (!producer) {
      this.logger.warn(`Produtor não encontrado para remoção: ${id}`);
      throw new NotFoundException('Produtor não encontrado');
    }

    await this.producerRepository.remove(producer);
    this.logger.debug(`Produtor removido com sucesso: ${id}`);
  }
}
