import { PartialType } from '@nestjs/mapped-types';
import { CreateFreeActivityDto } from './create-free-activity.dto';

export class UpdateFreeActivityDto extends PartialType(CreateFreeActivityDto) {}
