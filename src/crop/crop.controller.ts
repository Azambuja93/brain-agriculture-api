import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Patch,
    Delete,
    NotFoundException,
    Logger,
  } from '@nestjs/common';
  import { CropService } from './crop.service';
  import { CreateCropDto } from './dto/create-crop.dto';
  import { UpdateCropDto } from './dto/update-crop.dto';
  import { Crop } from './entities/crop.entity';
  
  @Controller('crops')
  export class CropController {
    private readonly logger = new Logger(CropController.name);
  
    constructor(private readonly cropService: CropService) {}
  
    @Post()
    async create(@Body() dto: CreateCropDto): Promise<Crop> {
      this.logger.log(`Criando nova cultura: ${dto.name}`);
      const crop = await this.cropService.create(dto);
      this.logger.log(`Cultura criada com sucesso. ID: ${crop.id}`);
      return crop;
    }
  
    @Get()
    async findAll(): Promise<Crop[]> {
      this.logger.log('Listando todas as culturas cadastradas');
      return this.cropService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Crop> {
      this.logger.log(`Buscando cultura com ID: ${id}`);
      const crop = await this.cropService.findOne(id);
      if (!crop) {
        this.logger.warn(`Cultura não encontrada. ID: ${id}`);
        throw new NotFoundException('Cultura não encontrada');
      }
      return crop;
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateCropDto): Promise<Crop> {
      this.logger.log(`Atualizando cultura ID: ${id}`);
      const updated = await this.cropService.update(id, dto);
      if (!updated) {
        this.logger.warn(`Falha ao atualizar. Cultura não encontrada. ID: ${id}`);
        throw new NotFoundException('Cultura não encontrada');
      }
      this.logger.log(`Cultura atualizada com sucesso. ID: ${id}`);
      return updated;
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Crop> {
      this.logger.log(`Removendo cultura com ID: ${id}`);
      const deleted = await this.cropService.remove(id);
      if (!deleted) {
        this.logger.warn(`Falha ao remover. Cultura não encontrada. ID: ${id}`);
        throw new NotFoundException('Cultura não encontrada');
      }
      this.logger.log(`Cultura removida com sucesso. ID: ${id}`);
      return deleted;
    }
  }
  