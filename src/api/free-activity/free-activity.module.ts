import { Module } from '@nestjs/common';
import { FreeActivityService } from './free-activity.service';
import { FreeActivityController } from './free-activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FreeActivitySchema } from './entities/free-activity.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FreeActivity', schema: FreeActivitySchema },
    ]),
  ],
  controllers: [FreeActivityController],
  providers: [FreeActivityService],
})
export class FreeActivityModule {}
