import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VolunteerModule } from './api/volunteer/volunteer.module';
import { BranchModule } from './api/branch/branch.module';
import { ManagerModule } from './api/manager/manager.module';
import { DistrictModule } from './api/district/district.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    VolunteerModule,
    BranchModule,
    ManagerModule,
    DistrictModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
