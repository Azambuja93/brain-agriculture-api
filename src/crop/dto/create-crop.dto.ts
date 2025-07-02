import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCropDto {
  @ApiProperty({
    example: 'Milho',
    description: 'Nome da cultura plantada',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '2fd05a7e-3275-4f47-8c17-0b328bdcf60c',
    description: 'ID da safra associada à cultura',
  })
  @IsUUID()
  @IsNotEmpty()
  harvestId: string;
}
