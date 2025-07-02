import { IsString, IsUUID, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateCropDto {
  @ApiProperty({ example: 'Soja', description: 'Nome da cultura plantada' })
  @IsString()
  name: string;
}

export class CreateHarvestDto {
  @ApiProperty({ example: 'Safra 2025', description: 'Identificação da safra' })
  @IsString()
  season: string;

  @ApiProperty({ example: '4f6b79c3-3b27-47a3-9b5e-7fc0d1e6b8d5', description: 'ID da propriedade associada' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({
    type: [CreateCropDto],
    description: 'Lista de culturas plantadas associadas à safra',
    example: [{ name: 'Milho' }, { name: 'Café' }],
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateCropDto)
  crops: CreateCropDto[];
}
