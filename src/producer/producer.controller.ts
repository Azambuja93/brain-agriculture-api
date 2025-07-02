import { Controller, Post, Body, Get, Param, Patch, Delete, Logger } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { Producer } from './entities/producer.entity';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Controller('producers')
export class ProducerController {
  private readonly logger = new Logger(ProducerController.name);

  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async create(@Body() dto: CreateProducerDto): Promise<Producer> {
    this.logger.log(`Criando novo produtor: ${dto.name}`);
    return this.producerService.create(dto);
  }

  @Get()
  async findAll(): Promise<Producer[]> {
    this.logger.log('Listando todos os produtores');
    return this.producerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producer> {
    this.logger.log(`Buscando produtor com ID: ${id}`);
    return this.producerService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProducerDto) {
    this.logger.log(`Atualizando produtor com ID: ${id}`);
    return this.producerService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Removendo produtor com ID: ${id}`);
    return this.producerService.remove(id);
  }
}
