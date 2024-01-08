import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictSchema } from './entities/district.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'District', schema: DistrictSchema }]),
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
