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
import { VolunteerService } from './volunteer.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';

@Controller('api/volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteerService.create(createVolunteerDto);
  }

  @Get()
  findAll() {
    return this.volunteerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.volunteerService.findOne(id);
  }

  @Put('updatePassword/:email/:password')
  updatePassword(@Param('email') email: string, @Param('password') password: string) {
    return this.volunteerService.updatePassword(email, password);
  }

  @Get('signIn/:idNumber/:password')
  signIn(
    @Param('idNumber') idNumber: string,
    @Param('password') password: string,
  ) {
    return this.volunteerService.signIn(idNumber, password);
  }

  @Get('isVolunteerExistsByEmail/:email')
  isVolunteerExistsByEmail(@Param('email') email: string) {
    return this.volunteerService.isVolunteerExistsByEmail(email);
  }

  @Put('updateVolunteer/:id')
  update(
    @Param('id') id: string,
    @Body() updateVolunteerDto: UpdateVolunteerDto,
  ) {
    return this.volunteerService.update(id, updateVolunteerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.volunteerService.remove(id);
  }
}
