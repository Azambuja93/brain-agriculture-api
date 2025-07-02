import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHarvestDto {
  @ApiPropertyOptional({
    example: 'Safra 2024/2025',
    description: 'Nova identificação da safra (opcional)',
  })
  @IsOptional()
  @IsString()
  season?: string;
}
