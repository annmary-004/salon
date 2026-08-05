import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string): Promise<Service | null> {
    return this.serviceRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Service>): Promise<Service> {
    const service = this.serviceRepo.create(data);
    return this.serviceRepo.save(service);
  }

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    await this.serviceRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.serviceRepo.delete(id);
  }

  async count(): Promise<number> {
    return this.serviceRepo.count();
  }
}
