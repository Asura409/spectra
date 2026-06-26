import {
  Controller, Get, Post, Body, Query, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PatrolService } from './patrol.service';
import { StartPatrolDto, SubmitPatrolLogDto } from './dto/patrol.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('patrols')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatrolController {
  constructor(private patrolService: PatrolService) {}

  @Get('routes/:siteId')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'SUPERVISOR', 'GUARD')
  async getRoutes(@Param('siteId') siteId: string) {
    return this.patrolService.getRoutes(siteId);
  }

  @Post('start')
  @Roles('GUARD', 'SUPERVISOR')
  @HttpCode(HttpStatus.CREATED)
  async startPatrol(@Body() dto: StartPatrolDto) {
    return this.patrolService.startPatrol(dto);
  }

  @Post('submit')
  @Roles('GUARD', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  async submitLog(@Body() dto: SubmitPatrolLogDto) {
    return this.patrolService.submitLog(dto);
  }

  @Get('history')
  @Roles('CEO', 'OPERATIONS_MANAGER', 'SUPERVISOR', 'CLIENT')
  async getHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('siteId') siteId?: string,
    @Query('guardId') guardId?: string,
  ) {
    return this.patrolService.getPatrolHistory({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      siteId, guardId,
    });
  }
}
