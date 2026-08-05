import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stylist } from './stylist.entity';

@Injectable()
export class StylistsService {
  constructor(
    @InjectRepository(Stylist)
    private readonly stylistRepo: Repository<Stylist>,
  ) {}

  async findAll(): Promise<Stylist[]> {
    return this.stylistRepo.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string): Promise<Stylist | null> {
    return this.stylistRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Stylist>): Promise<Stylist> {
    const stylist = this.stylistRepo.create(data);
    return this.stylistRepo.save(stylist);
  }

  async update(id: string, data: Partial<Stylist>): Promise<Stylist | null> {
    await this.stylistRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.stylistRepo.delete(id);
  }

  async count(): Promise<number> {
    return this.stylistRepo.count();
  }
}
