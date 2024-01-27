import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagerSchema } from './entities/manager.entity';
import { AssociationModule } from '../association/association.module';
import { CacheService } from 'src/sharedServices/cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Manager', schema: ManagerSchema }]),
    AssociationModule,
    CacheModule.register({
      ttl: 300000,
    }),
  ],
  controllers: [ManagerController],
  providers: [ManagerService, CacheService, MailService],
})
export class ManagerModule {}
