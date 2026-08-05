import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { StylistsModule } from './stylists/stylists.module';
import { BookingsModule } from './bookings/bookings.module';
import { EmailModule } from './email/email.module';
import { SeedModule } from './seed/seed.module';
import { User } from './users/user.entity';
import { Service } from './services/service.entity';
import { Stylist } from './stylists/stylist.entity';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): any => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          // Production: Use PostgreSQL on Render
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Service, Stylist, Booking],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
            logging: false,
          };
        }
        // Development: Use SQLite locally
        return {
          type: 'better-sqlite3',
          database: 'salon.sqlite',
          entities: [User, Service, Stylist, Booking],
          synchronize: true,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ServicesModule,
    StylistsModule,
    BookingsModule,
    EmailModule,
    SeedModule,
  ],
})
export class AppModule {}
