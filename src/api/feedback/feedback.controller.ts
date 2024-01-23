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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post('')
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return JSON.stringify(this.feedbackService.create(createFeedbackDto));
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Get('/getFeedbackByVolunteerId/:volunteerId')
  async getFeedbackByVolunteerId(@Param('volunteerId') volunteerId: string) {
    return this.feedbackService.getFeedbackByVolunteerId(volunteerId);
  }

  @Get('/getFeedbackByManagerId/:managerId')
  async getFeedbackByManagerId(@Param('managerId') managerId: string) {
    return this.feedbackService.getFeedbackByManagerId(managerId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
