import { Module } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VolunteerSchema } from './entities/volunteer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Volunteer', schema: VolunteerSchema }]),
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}
