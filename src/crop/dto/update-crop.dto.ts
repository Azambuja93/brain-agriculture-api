import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCropDto {
  @ApiPropertyOptional({
    example: 'Café',
    description: 'Nome atualizado da cultura (opcional)',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
