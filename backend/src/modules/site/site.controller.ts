import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto, UpdateSiteDto } from './dto/site.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('sites')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SiteController {
  constructor(private siteService: SiteService) {}

  @Get()
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR', 'SUPERVISOR', 'CLIENT')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('riskLevel') riskLevel?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.siteService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search, riskLevel, clientId,
    });
  }

  @Get(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR', 'SUPERVISOR', 'CLIENT')
  async findOne(@Param('id') id: string) {
    return this.siteService.findOne(id);
  }

  @Post()
  @Roles('CEO', 'OPERATIONS_MANAGER')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSiteDto) {
    return this.siteService.create(dto);
  }

  @Patch(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER')
  async update(@Param('id') id: string, @Body() dto: UpdateSiteDto) {
    return this.siteService.update(id, dto);
  }

  @Delete(':id')
  @Roles('CEO')
  async remove(@Param('id') id: string) {
    return this.siteService.remove(id);
  }
}
