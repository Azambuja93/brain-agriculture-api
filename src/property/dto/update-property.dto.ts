import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePropertyDto {
  @ApiPropertyOptional({
    example: 'Fazenda Nova Esperança',
    description: 'Nome da fazenda',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'São Carlos',
    description: 'Cidade da fazenda',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'SP',
    description: 'Estado da fazenda',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    example: 120,
    description: 'Área total em hectares',
  })
  @IsOptional()
  @IsNumber()
  totalArea?: number;

  @ApiPropertyOptional({
    example: 70,
    description: 'Área agricultável em hectares',
  })
  @IsOptional()
  @IsNumber()
  agriculturalArea?: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Área de vegetação em hectares',
  })
  @IsOptional()
  @IsNumber()
  vegetationArea?: number;
}
