import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Patch,
    Param,
    NotFoundException,
    Logger,
  } from '@nestjs/common';
  import { HarvestService } from './harvest.service';
  import { CreateHarvestDto } from './dto/create-harvest.dto';
  import { Harvest } from './entities/harvest.entity';
  import { UpdateHarvestDto } from './dto/update-harvest.dto';
  
  @Controller('harvests')
  export class HarvestController {
    private readonly logger = new Logger(HarvestController.name);
  
    constructor(private readonly harvestService: HarvestService) {}
  
    @Post()
    async create(@Body() dto: CreateHarvestDto) {
      this.logger.log(`Criando nova safra para propriedade ${dto.propertyId}`);
      return this.harvestService.create(dto);
    }
  
    @Get()
    async findAll(): Promise<Harvest[]> {
      this.logger.log('Listando todas as safras');
      return this.harvestService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      this.logger.log(`Buscando safra com id ${id}`);
      const harvest = await this.harvestService.findOne(id);
      if (!harvest) {
        this.logger.warn(`Safra com id ${id} não encontrada`);
        throw new NotFoundException('Safra não encontrada');
      }
      return harvest;
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateHarvestDto) {
      this.logger.log(`Atualizando safra com id ${id}`);
      const updated = await this.harvestService.update(id, dto);
      if (!updated) {
        this.logger.warn(`Tentativa de atualizar safra não encontrada com id ${id}`);
        throw new NotFoundException('Safra não encontrada');
      }
      return updated;
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      this.logger.log(`Removendo safra com id ${id}`);
      const deleted = await this.harvestService.remove(id);
      if (!deleted) {
        this.logger.warn(`Tentativa de remover safra não encontrada com id ${id}`);
        throw new NotFoundException('Safra não encontrada');
      }
      return deleted;
    }
  }
  