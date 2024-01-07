import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
