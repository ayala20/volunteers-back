/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FreeActivityService } from './free-activity.service';
import { CreateFreeActivityDto } from './dto/create-free-activity.dto';
import { UpdateFreeActivityDto } from './dto/update-free-activity.dto';

@Controller('api/free-activity')
export class FreeActivityController {
  constructor(private readonly freeActivityService: FreeActivityService) { }

  @Post()
  create(@Body() createFreeActivityDto: CreateFreeActivityDto) {
    return JSON.stringify(this.freeActivityService.create(createFreeActivityDto));
  }

  @Get()
  findAll() {
    return this.freeActivityService.findAll();
  }

  @Get('/findAllRequestByManagerAndStatus/:managerId/:statuses')
  findAllRequestByManagerAndStatus(@Param('managerId') managerId: string, @Param('statuses') statuses: string) {
    return this.freeActivityService.findAllRequestByManagerAndStatus(managerId, statuses);
  }

  @Get('/findAllRequestByVolunteerAndStatus/:volunteerId/:statuses')
  findAllRequestByVolunteerAndStatus(@Param('volunteerId') volunteerId: string, @Param('statuses') statuses: string) {
    return this.freeActivityService.findAllRequestByVolunteerAndStatus(volunteerId, statuses);
  }

  @Get('/findAllRequestByAssociation/:associationId')
  findAllRequestByAssociation(@Param('associationId') associationId: string) {
    return this.freeActivityService.findAllRequestByAssociation(associationId);
  }

  @Get(':districtId/:categoryId')
  filterFreeActivitiesByDistrictAndCategory(@Param('districtId') districtId: string, @Param('categoryId') categoryId: string) {
    return this.freeActivityService.filterFreeActivitiesByDistrictAndCategory(districtId, categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freeActivityService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreeActivityDto: UpdateFreeActivityDto,
  ) {
    return this.freeActivityService.update(id, updateFreeActivityDto);
  }

  @Put(':freeActivityId/:userId/:status')
  updateStatus(
    @Param('freeActivityId') freeActivityId: string,
    @Param('userId') userId: string,
    @Param('status') status: string,
  ) {
    return JSON.stringify(this.freeActivityService.updateStatus(freeActivityId, userId, status));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freeActivityService.remove(id);
  }
}
