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
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }

  @Get()
  findAll() {
    return this.managerService.findAll();
  }

  @Get('signIn/:userName/:password')
  signIn(
    @Param('userName') userName: string,
    @Param('password') password: string,
  ) {
    console.log(userName, password);
    return this.managerService.signIn(userName, password);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(id);
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
