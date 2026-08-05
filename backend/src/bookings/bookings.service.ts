import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Booking } from './booking.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly emailService: EmailService,
  ) {}

  async create(data: {
    userId: string;
    serviceId: string;
    stylistId: string;
    date: string;
    time: string;
    notes?: string;
  }): Promise<Booking> {
    // Check for existing booking at this slot
    const existing = await this.bookingRepo.findOne({
      where: {
        stylistId: data.stylistId,
        date: data.date,
        time: data.time,
        status: In(['pending', 'confirmed']),
      },
    });

    if (existing) {
      throw new BadRequestException('Stylist is already booked for this time slot');
    }

    const booking = this.bookingRepo.create(data);
    const saved = await this.bookingRepo.save(booking);

    const bookingWithRelations = await this.bookingRepo.findOne({
      where: { id: saved.id },
      relations: { service: true, stylist: true, user: true },
    }) as any;
    
    // Send booking confirmation email asynchronously
    this.emailService.sendBookingConfirmation(
      bookingWithRelations.user.email,
      bookingWithRelations.user.name,
      bookingWithRelations.service.name,
      bookingWithRelations.date,
      bookingWithRelations.time
    );

    return bookingWithRelations;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { userId },
      relations: { service: true, stylist: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({
      relations: { user: true, service: true, stylist: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string): Promise<Booking | null> {
    await this.bookingRepo.update(id, { status });
    return this.bookingRepo.findOne({
      where: { id },
      relations: { user: true, service: true, stylist: true },
    });
  }

  async getAvailableSlots(stylistId: string, date: string): Promise<string[]> {
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00',
    ];

    const booked = await this.bookingRepo.find({
      where: {
        stylistId,
        date,
        status: In(['pending', 'confirmed']),
      },
      select: { time: true },
    });

    const bookedTimes = booked.map((b) => b.time);
    return allSlots.filter((slot) => !bookedTimes.includes(slot));
  }

  async count(): Promise<number> {
    return this.bookingRepo.count();
  }

  async countByStatus(status: string): Promise<number> {
    return this.bookingRepo.count({ where: { status } });
  }
}
