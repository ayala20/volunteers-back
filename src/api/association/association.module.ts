import { Module } from '@nestjs/common';
import { AssociationService } from './association.service';
import { AssociationController } from './association.controller';
import { AssociationSchema } from './entities/association.entity';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { MailModule } from 'src/mail/mail.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Association', schema: AssociationSchema },
    ]),
    MailModule,
  ],
  controllers: [AssociationController],
  providers: [AssociationService],
  exports: [AssociationService],
})
export class AssociationModule {}
