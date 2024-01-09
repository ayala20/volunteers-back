import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Association } from './entities/association.entity';

@Injectable()
export class AssociationService {
  constructor(
    @InjectModel('Association') private associationModel: Model<Association>,
  ) {}

  async create(createAssociationDto: CreateAssociationDto) {
    const newAssociation = new this.associationModel(createAssociationDto);
    const result = await newAssociation.save();
    return result.id;
  }

  async findAll(is_approved: boolean) {
    const associations = await this.associationModel
      .find({ is_approved })
      .exec();
    return associations.map((association) => ({
      id: association.id,
      name: association.name,
      address: association.address,
      email: association.email,
      phone: association.phone,
      password: association.password,
      file: association.file,
      logo_image: association.logo_image,
    }));
  }

  async findAssociation(id: string) {
    let association: any;
    try {
      association = await this.associationModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Association.');
    }
    if (!association) {
      throw new NotFoundException('Could not find Association.');
    }
    return association;
  }

  async findOne(id: string) {
    const association = await this.findAssociation(id);
    return {
      id: association.id,
      name: association.name,
      address: association.address,
      email: association.email,
      phone: association.phone,
      password: association.password,
      file: association.file,
      logo_image: association.logo_image,
    };
  }

  async update(id: string, updateAssociationDto: UpdateAssociationDto) {
    const updatedAssociation = await this.findAssociation(id);
    if (updateAssociationDto.name) {
      updatedAssociation.name = updateAssociationDto.name;
    }
    if (updateAssociationDto.address) {
      updatedAssociation.address = updateAssociationDto.address;
    }
    if (updateAssociationDto.email) {
      updatedAssociation.email = updateAssociationDto.email;
    }
    if (updateAssociationDto.phone) {
      updatedAssociation.phone = updateAssociationDto.phone;
    }
    if (updateAssociationDto.password) {
      updatedAssociation.password = updateAssociationDto.password;
    }
    if (updateAssociationDto.file) {
      updatedAssociation.file = updateAssociationDto.file;
    }
    if (updateAssociationDto.logo_image) {
      updatedAssociation.logo_image = updateAssociationDto.logo_image;
    }
    await updatedAssociation.save();
    return `This action updates a #${id} association`;
  }

  async updateToApproved(id: string) {
    const updatedAssociation = await this.findAssociation(id);
    updatedAssociation.is_approved = true;
    await updatedAssociation.save();
    return `This action updates a #${id} association to approved`;
  }

  async remove(id: string) {
    const result = await this.associationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Association.');
    }
    return `This action removes a #${id} association`;
  }
}
