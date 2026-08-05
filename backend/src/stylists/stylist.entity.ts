import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity('stylists')
export class Stylist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, nullable: true })
  role: string;

  @Column({ type: 'jsonb', default: [] })
  specialization: string[];

  @Column({ type: 'int', nullable: true })
  experience: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviews: number;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'jsonb', default: [] })
  availability: { day: string; startTime: string; endTime: string }[];

  @OneToMany(() => Booking, (booking) => booking.stylist)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
