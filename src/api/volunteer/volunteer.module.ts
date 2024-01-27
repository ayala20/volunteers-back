import { Module } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VolunteerSchema } from './entities/volunteer.entity';
import { CacheService } from '../../sharedServices/cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Volunteer', schema: VolunteerSchema }]),
    CacheModule.register({
      ttl: 300000,
    }),
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService, CacheService, MailService],
})
export class VolunteerModule {}
