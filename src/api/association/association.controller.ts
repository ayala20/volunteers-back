import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AssociationService } from './association.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';

@Controller('api/association')
export class AssociationController {
  constructor(private readonly associationService: AssociationService) {}

  @Post()
  create(@Body() createAssociationDto: CreateAssociationDto) {
    return this.associationService.create(createAssociationDto);
  }

  @Get()
  findAll() {
    return this.associationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.associationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ) {
    return this.associationService.update(id, updateAssociationDto);
  }

  @Put(':id')
  updateToApproved(@Param('id') id: string) {
    return this.associationService.updateToApproved(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.associationService.remove(id);
  }
}
