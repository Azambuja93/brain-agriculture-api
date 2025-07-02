import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty({
    description: 'Total de fazendas cadastradas',
    example: 10,
  })
  totalFarms: number;

  @ApiProperty({
    description: 'Total de hectares registrados',
    example: 3554.23,
  })
  totalHectares: number;
}
