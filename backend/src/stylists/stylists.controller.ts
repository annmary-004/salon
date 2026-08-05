import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StylistsService } from './stylists.service';
import { Stylist } from './stylist.entity';
import { JwtAuthGuard, AdminGuard } from '../auth/guards';

@Controller('stylists')
export class StylistsController {
  constructor(private readonly stylistsService: StylistsService) {}

  @Get()
  async findAll(): Promise<Stylist[]> {
    return this.stylistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Stylist | null> {
    return this.stylistsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() data: Partial<Stylist>): Promise<Stylist> {
    return this.stylistsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() data: Partial<Stylist>): Promise<Stylist | null> {
    return this.stylistsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.stylistsService.delete(id);
  }
}
