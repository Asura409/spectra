import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR')
  async findAll(
    @Query('page') page?: string, @Query('limit') limit?: string,
    @Query('search') search?: string, @Query('billingStatus') billingStatus?: string,
  ) {
    return this.clientService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search, billingStatus,
    });
  }

  @Get(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'HR', 'CLIENT')
  async findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Post()
  @Roles('CEO', 'OPERATIONS_MANAGER')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

  @Patch(':id')
  @Roles('CEO', 'OPERATIONS_MANAGER')
  async update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientService.update(id, dto);
  }

  @Delete(':id')
  @Roles('CEO')
  async remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
