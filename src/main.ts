import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import { join } from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/public', express.static(join(__dirname, 'public')));

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
