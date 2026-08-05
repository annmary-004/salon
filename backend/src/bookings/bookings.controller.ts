import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard, AdminGuard } from '../auth/guards';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: any,
    @Body() body: { serviceId: string; stylistId: string; date: string; time: string; notes?: string },
  ) {
    return this.bookingsService.create({
      userId: req.user.id,
      serviceId: body.serviceId,
      stylistId: body.stylistId,
      date: body.date,
      time: body.time,
      notes: body.notes,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(@Request() req: any) {
    return this.bookingsService.findByUser(req.user.id);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllBookings() {
    return this.bookingsService.findAll();
  }

  @Get('slots')
  async getAvailableSlots(
    @Query('stylistId') stylistId: string,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getAvailableSlots(stylistId, date);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.bookingsService.updateStatus(id, status);
  }
}
