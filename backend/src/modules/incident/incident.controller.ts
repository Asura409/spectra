import {
  Controller, Get, Post, Patch, Body, Query, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { IncidentService } from './incident.service';
import { ReportIncidentDto, UpdateIncidentStatusDto } from './dto/incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('incidents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IncidentController {
  constructor(private incidentService: IncidentService) {}

  @Post()
  @Roles('GUARD', 'SUPERVISOR', 'OPERATIONS_MANAGER')
  @HttpCode(HttpStatus.CREATED)
  async reportIncident(@Body() dto: ReportIncidentDto) {
    return this.incidentService.reportIncident(dto);
  }

  @Patch(':id/status')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'SUPERVISOR')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateIncidentStatusDto) {
    return this.incidentService.updateStatus(id, dto);
  }

  @Get()
  @Roles('CEO', 'OPERATIONS_MANAGER', 'SUPERVISOR', 'HR', 'CLIENT')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('siteId') siteId?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.incidentService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      siteId, status, type,
    });
  }

  @Get(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'SUPERVISOR', 'HR', 'CLIENT')
  async findOne(@Param('id') id: string) {
    return this.incidentService.findOne(id);
  }
}
