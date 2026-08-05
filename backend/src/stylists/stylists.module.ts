import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stylist } from './stylist.entity';
import { StylistsController } from './stylists.controller';
import { StylistsService } from './stylists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stylist])],
  controllers: [StylistsController],
  providers: [StylistsService],
  exports: [StylistsService],
})
export class StylistsModule {}
