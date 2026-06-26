import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CheckInDto, CheckOutDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // Distance calculation using Haversine formula
  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }

  async checkIn(dto: CheckInDto) {
    // 1. Verify site and guard exist
    const site = await this.prisma.site.findUnique({ where: { id: dto.siteId } });
    if (!site) throw new NotFoundException('Site not found');

    const guard = await this.prisma.guard.findUnique({ where: { id: dto.guardId } });
    if (!guard) throw new NotFoundException('Guard not found');

    // 2. Check if guard is already checked in today without checking out
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await this.prisma.attendance.findFirst({
      where: {
        guardId: dto.guardId,
        createdAt: { gte: today },
        checkOutTime: null,
      },
    });

    if (existingRecord) {
      throw new BadRequestException('Guard is already checked in.');
    }

    // 3. Geofence Check (e.g., must be within 200 meters of the site)
    const distance = this.getDistance(site.latitude, site.longitude, dto.latitude, dto.longitude);
    const isWithinGeofence = distance <= 200; // 200m radius

    // 4. Create attendance record
    return this.prisma.attendance.create({
      data: {
        guardId: dto.guardId,
        siteId: dto.siteId,
        checkInTime: new Date(),
        checkInLocation: JSON.stringify({ lat: dto.latitude, lng: dto.longitude }),
        status: isWithinGeofence ? 'ON_TIME' : 'FLAGGED',
        photoUrl: dto.photoUrl,
        verifiedStatus: isWithinGeofence,
      },
    });
  }

  async checkOut(dto: CheckOutDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendance.findFirst({
      where: {
        guardId: dto.guardId,
        createdAt: { gte: today },
        checkOutTime: null,
      },
    });

    if (!record) {
      throw new BadRequestException('No active check-in found for today.');
    }

    return this.prisma.attendance.update({
      where: { id: record.id },
      data: {
        checkOutTime: new Date(),
        checkOutLocation: JSON.stringify({ lat: dto.latitude, lng: dto.longitude }),
      },
    });
  }

  async getAttendanceHistory(query: { page?: number; limit?: number; siteId?: string; date?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.siteId) where.siteId = query.siteId;
    if (query.date) {
      const startOfDay = new Date(query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(query.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.createdAt = { gte: startOfDay, lte: endOfDay };
    }

    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          guard: { select: { id: true, fullName: true, currentShift: true } },
          site: { select: { id: true, name: true } },
        },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }
}
