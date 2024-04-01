/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AssociationService } from './association.service';
import { CreateAssociationDto, StatusAssociation } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/association')
export class AssociationController {
  private createAssociationDto: CreateAssociationDto;
  constructor(private readonly associationService: AssociationService) { }

  @Post()
  create(@Body() createAssociationDto: CreateAssociationDto) {
    return this.associationService.create(createAssociationDto);
  }

  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/pdf',
        filename: (req, file, callback) => {
          const uniqueSuffix = file.originalname;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file) {
    return JSON.stringify(file);
  }

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images',
      filename: (req, file, callback) => {
        const uniqueSuffix = file.originalname;
        callback(null, uniqueSuffix);
      },
    }),
  }),)
  uploadImage(@UploadedFile() file) {
    return JSON.stringify(file.filename);
  }

  @Get('/getAllByStatus/:status')
  findAll(@Param('status') status: StatusAssociation) {
    return this.associationService.findAll(status);
  }

  @Get('/getById/:id')
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

  @Put(':id/:status')
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: string,
  ) {
    return JSON.stringify(this.associationService.updateStatus(id, status));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.associationService.remove(id);
  }
}
