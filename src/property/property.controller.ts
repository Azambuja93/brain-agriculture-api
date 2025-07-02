import { Controller, Post, Body, Get, Delete, Param, Patch, Logger } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';

@Controller('properties')
export class PropertyController {
  private readonly logger = new Logger(PropertyController.name);

  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    this.logger.log(`Criando nova propriedade para produtor: ${createPropertyDto.producerId}`);
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  findAll() {
    this.logger.log('Buscando todas as propriedades');
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Property> {
    this.logger.log(`Buscando propriedade com ID: ${id}`);
    return this.propertyService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removendo propriedade com ID: ${id}`);
    return this.propertyService.remove(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    this.logger.log(`Atualizando propriedade com ID: ${id}`);
    return this.propertyService.update(id, dto);
  }
}
