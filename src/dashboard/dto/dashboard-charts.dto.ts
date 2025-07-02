import { ApiProperty } from '@nestjs/swagger';

export class DashboardChartsDto {
  @ApiProperty({
    description: 'Quantidade de fazendas por estado',
    example: [
      { state: 'SP', count: 5 },
      { state: 'MG', count: 2 },
    ],
    isArray: true,
  })
  farmsPerState: { state: string; count: number }[];

  @ApiProperty({
    description: 'Quantidade de culturas plantadas',
    example: [
      { crop: 'Soja', count: 3 },
      { crop: 'Milho', count: 2 },
    ],
    isArray: true,
  })
  cropsPlanted: { crop: string; count: number }[];

  @ApiProperty({
    description: 'Uso do solo (em hectares)',
    example: {
      agriculturalArea: 1200.5,
      vegetationArea: 800.75,
    },
  })
  landUse: {
    agriculturalArea: number;
    vegetationArea: number;
  };
}
