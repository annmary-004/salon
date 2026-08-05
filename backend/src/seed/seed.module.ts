import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { ServicesModule } from '../services/services.module';
import { StylistsModule } from '../stylists/stylists.module';

@Module({
  imports: [UsersModule, ServicesModule, StylistsModule],
  providers: [SeedService],
})
export class SeedModule {}
