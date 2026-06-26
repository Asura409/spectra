import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { GuardService } from './guard.service';
import { CreateGuardDto, UpdateGuardDto, TransferGuardDto } from './dto/guard.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('guards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GuardController {
  constructor(private guardService: GuardService) {}

  @Get()
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR', 'SUPERVISOR')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('siteId') siteId?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.guardService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status, siteId, search, sortBy, sortOrder,
    });
  }

  @Get('stats')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR')
  async getStats() {
    return this.guardService.getStats();
  }

  @Get(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR', 'SUPERVISOR')
  async findOne(@Param('id') id: string) {
    return this.guardService.findOne(id);
  }

  @Post()
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGuardDto) {
    return this.guardService.create(dto);
  }

  @Patch(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR')
  async update(@Param('id') id: string, @Body() dto: UpdateGuardDto) {
    return this.guardService.update(id, dto);
  }

  @Post(':id/transfer')
  @Roles('CEO', 'OPERATIONS_MANAGER')
  async transfer(@Param('id') id: string, @Body() dto: TransferGuardDto) {
    return this.guardService.transfer(id, dto);
  }

  @Delete(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR')
  async deactivate(@Param('id') id: string) {
    return this.guardService.deactivate(id);
  }
}
