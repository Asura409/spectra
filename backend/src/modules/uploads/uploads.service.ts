import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private getFileUrl(filename: string): string {
    const baseUrl = process.env.API_URL || 'http://localhost:3001';
    return `${baseUrl}/uploads/${filename}`;
  }

  async uploadGuardPhoto(guardId: string, file: Express.Multer.File, organizationId: string) {
    const guard = await this.prisma.guard.findFirst({
      where: { id: guardId, organizationId },
      select: { id: true, photoUrl: true },
    });
    if (!guard) throw new NotFoundException('Guard not found');

    let photoUrl: string;

    if (this.cloudinary.isConfigured()) {
      // Upload to Cloudinary
      const result = await this.cloudinary.uploadImage(file.buffer, 'spectra/guards');
      photoUrl = result.url;

      // Delete old Cloudinary photo if it exists
      const oldPublicId = this.cloudinary.extractPublicId(guard.photoUrl || '');
      if (oldPublicId) {
        await this.cloudinary.deleteImage(oldPublicId);
      }
    } else {
      // Fallback: use local storage URL (Multer saves to uploads/ folder)
      photoUrl = this.getFileUrl((file as any).filename || file.originalname);
    }

    return this.prisma.guard.update({
      where: { id: guardId },
      data: { photoUrl },
      select: { id: true, photoUrl: true },
    });
  }

  async attachIncidentPhoto(
    incidentId: string,
    file: Express.Multer.File,
    organizationId: string,
  ) {
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, site: { organizationId } },
      select: { id: true, photos: true },
    });
    if (!incident) throw new NotFoundException('Incident not found');

    let url: string;

    if (this.cloudinary.isConfigured()) {
      const result = await this.cloudinary.uploadImage(file.buffer, 'spectra/incidents');
      url = result.url;
    } else {
      url = this.getFileUrl((file as any).filename || file.originalname);
    }

    const photos = JSON.parse(incident.photos || '[]');
    photos.push(url);

    return this.prisma.incident.update({
      where: { id: incidentId },
      data: { photos: JSON.stringify(photos) },
    });
  }

  async attachIncidentVideo(
    incidentId: string,
    file: Express.Multer.File,
    organizationId: string,
  ) {
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, site: { organizationId } },
      select: { id: true, videos: true },
    });
    if (!incident) throw new NotFoundException('Incident not found');

    // Videos use local storage for now (Cloudinary video upload needs different handling)
    const url = this.getFileUrl((file as any).filename || file.originalname);
    const videos = JSON.parse(incident.videos || '[]');
    videos.push(url);

    return this.prisma.incident.update({
      where: { id: incidentId },
      data: { videos: JSON.stringify(videos) },
    });
  }

  async attachIncidentVoiceNote(
    incidentId: string,
    file: Express.Multer.File,
    organizationId: string,
  ) {
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, site: { organizationId } },
      select: { id: true, voiceNotes: true },
    });
    if (!incident) throw new NotFoundException('Incident not found');

    const url = this.getFileUrl((file as any).filename || file.originalname);
    const notes = JSON.parse(incident.voiceNotes || '[]');
    notes.push(url);

    return this.prisma.incident.update({
      where: { id: incidentId },
      data: { voiceNotes: JSON.stringify(notes) },
    });
  }

  async attachAttendancePhoto(
    attendanceId: string,
    file: Express.Multer.File,
    organizationId: string,
  ) {
    const attendance = await this.prisma.attendance.findFirst({
      where: { id: attendanceId, guard: { organizationId } },
      select: { id: true },
    });
    if (!attendance) throw new NotFoundException('Attendance record not found');

    let url: string;

    if (this.cloudinary.isConfigured()) {
      const result = await this.cloudinary.uploadImage(file.buffer, 'spectra/attendance');
      url = result.url;
    } else {
      url = this.getFileUrl((file as any).filename || file.originalname);
    }

    return this.prisma.attendance.update({
      where: { id: attendanceId },
      data: { photoUrl: url },
    });
  }
}
