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
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';

@Controller('api/manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) { }
  @Post()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }

  @Get()
  findAll() {
    return this.managerService.findAll();
  }

  @Get('signIn/:email/:password')
  signIn(@Param('email') email: string, @Param('password') password: string) {
    return this.managerService.signIn(email, password);
  }

  @Get('isCodeGood/:email/:password')
  isCodeGood(@Param('email') email: string, @Param('password') password: string) {
    return this.managerService.isCodeGood(email, password);
  }

  @Put('updatePassword/:email/:password')
  updatePassword(@Param('email') email: string, @Param('password') password: string) {
    return this.managerService.updatePassword(email, password);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(id);
  }

  @Get('isManagerExistsByEmail/:email')
  isManagerExistsByEmail(@Param('email') email: string) {
    return this.managerService.isManagerExistsByEmail(email);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managerService.update(id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managerService.remove(id);
  }
}
