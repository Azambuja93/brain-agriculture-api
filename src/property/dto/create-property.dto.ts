import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({
    example: 'Fazenda Boa Vista',
    description: 'Nome da propriedade rural',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Araraquara',
    description: 'Cidade onde a propriedade está localizada',
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado (UF) da propriedade',
  })
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: 100,
    description: 'Área total da fazenda em hectares',
  })
  @IsNumber()
  totalArea: number;

  @ApiProperty({
    example: 60,
    description: 'Área agricultável da fazenda em hectares',
  })
  @IsNumber()
  agriculturalArea: number;

  @ApiProperty({
    example: 40,
    description: 'Área de vegetação da fazenda em hectares',
  })
  @IsNumber()
  vegetationArea: number;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh78',
    description: 'UUID do produtor dono da propriedade',
  })
  @IsUUID()
  @IsNotEmpty()
  producerId: string;
}
