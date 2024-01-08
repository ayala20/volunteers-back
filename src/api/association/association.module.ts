import { Module } from '@nestjs/common';
import { AssociationService } from './association.service';
import { AssociationController } from './association.controller';
import { AssociationSchema } from './entities/association.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Association', schema: AssociationSchema },
    ]),
  ],
  controllers: [AssociationController],
  providers: [AssociationService],
})
export class AssociationModule {}
