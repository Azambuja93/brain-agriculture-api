import { Controller, Get, Logger } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    this.logger.log('Requisição recebida: GET /dashboard/summary');
    return this.dashboardService.getSummary();
  }

  @Get('charts')
  getCharts() {
    this.logger.log('Requisição recebida: GET /dashboard/charts');
    return this.dashboardService.getCharts();
  }
}
