import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StartPatrolDto, SubmitPatrolLogDto } from './dto/patrol.dto';

@Injectable()
export class PatrolService {
  constructor(private prisma: PrismaService) {}

  async getRoutes(siteId: string) {
    return this.prisma.patrolRoute.findMany({
      where: { siteId },
      include: {
        checkpoints: { orderBy: { sequenceOrder: 'asc' } },
      },
    });
  }

  async startPatrol(dto: StartPatrolDto) {
    const route = await this.prisma.patrolRoute.findUnique({
      where: { id: dto.routeId },
      include: { checkpoints: true },
    });
    if (!route) throw new NotFoundException('Patrol route not found');

    const guard = await this.prisma.guard.findUnique({ where: { id: dto.guardId } });
    if (!guard) throw new NotFoundException('Guard not found');

    // Create the patrol record
    return this.prisma.patrolRecord.create({
      data: {
        routeId: dto.routeId,
        guardId: dto.guardId,
        startTime: new Date(),
        status: 'IN_PROGRESS',
        scannedCheckpoints: '[]',
        missedCheckpoints: '[]',
      },
    });
  }

  async submitLog(dto: SubmitPatrolLogDto) {
    const record = await this.prisma.patrolRecord.findUnique({
      where: { id: dto.patrolRecordId },
      include: { route: { include: { checkpoints: true } } },
    });

    if (!record) throw new NotFoundException('Patrol record not found');
    if (record.status === 'COMPLETED') throw new BadRequestException('Patrol already completed');

    const expectedCheckpoints = record.route.checkpoints.map(cp => cp.id);
    const scannedIds = dto.scans.map(s => s.checkpointId);

    const missedCheckpoints = expectedCheckpoints.filter(id => !scannedIds.includes(id));
    const completionPercentage = (scannedIds.length / expectedCheckpoints.length) * 100;

    return this.prisma.patrolRecord.update({
      where: { id: dto.patrolRecordId },
      data: {
        endTime: new Date(),
        status: 'COMPLETED',
        scannedCheckpoints: JSON.stringify(dto.scans),
        missedCheckpoints: JSON.stringify(missedCheckpoints),
        completionPercentage,
        incidentReportId: dto.incidentReportId,
        generalNotes: dto.generalNotes,
      },
    });
  }

  async getPatrolHistory(query: { page?: number; limit?: number; siteId?: string; guardId?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.guardId) where.guardId = query.guardId;
    
    // To filter by siteId, we need to join through route
    if (query.siteId) {
      where.route = { siteId: query.siteId };
    }

    const [data, total] = await Promise.all([
      this.prisma.patrolRecord.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          guard: { select: { id: true, fullName: true } },
          route: { select: { id: true, name: true, site: { select: { id: true, name: true } } } },
        },
      }),
      this.prisma.patrolRecord.count({ where }),
    ]);

    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }
}
