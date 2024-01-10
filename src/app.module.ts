import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './api/category/category.module';
import { VolunteerModule } from './api/volunteer/volunteer.module';
import { ManagerModule } from './api/manager/manager.module';
import { DistrictModule } from './api/district/district.module';
import { AssociationModule } from './api/association/association.module';
import * as dotenv from 'dotenv';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
dotenv.config();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CategoryModule,
    VolunteerModule,
    ManagerModule,
    DistrictModule,
    AssociationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
