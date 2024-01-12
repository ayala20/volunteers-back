/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Association } from './entities/association.entity';
import {
  CreateAssociationDto,
  StatusAssociation,
} from './dto/create-association.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AssociationService {
  constructor(
    @InjectModel('Association') private associationModel: Model<Association>,
    private mailerService: MailerService
  ) { }

  async create(createAssociationDto: CreateAssociationDto) {
    const newAssociation = new this.associationModel(createAssociationDto);
    const result = await newAssociation.save();
    return result.id;
  }

  async findAll(status: StatusAssociation) {
    const associations = await this.associationModel
      .find({ status: status })
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

  async sendEmail(email: string, status: string, name: string, password?: string) {
    if (status == StatusAssociation.APPROVED) {
      await this.mailerService.sendMail({
        to: email,
        subject: 'תשובה לבקשת פתיחת מערך התנדבות',
        template: './transactional.html',
        context: {
          name: name,
          status: "block",
          password: password,
          message: "נענתה בחיוב",
          m1: "קוד העמותה במערכת הינו:",
          m2: "קוד זה ישמש את האחראים מטעם העמותה לרישום למערכת שלנו"
        },
      });
    }
    else {
      await this.mailerService.sendMail({
        to: email,
        subject: 'תשובה לבקשת פתיחת מערך התנדבות',
        template: './transactional.html',
        context:
        {
          name: name,
          status: "none",
          message: "לא אושרה",
          password: password,
          m1: "",
          m2: "",
        },
      });
    }
  }

  generateRandomCode(length: number): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code: string = '';
    for (let i: number = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  async updateStatus(id: string, status: string) {
    const updatedAssociation = await this.findAssociation(id);
    if (status == StatusAssociation.APPROVED) {
      const password = this.generateRandomCode(8);

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      updatedAssociation.password = hashPassword;
      this.sendEmail(updatedAssociation.email, status, updatedAssociation.name, password);
    }
    if (status == StatusAssociation.FAILED) {
      this.sendEmail(updatedAssociation.email, status, updatedAssociation.name, "");
    }
    if (status) {
      updatedAssociation.status = status;
    }
    try {
      await updatedAssociation.save();
    } catch (error) {
      throw new NotFoundException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return `This action updates a #${id} association to approved`;
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

  async remove(id: string) {
    const result = await this.associationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Association.');
    }
    return `This action removes a #${id} association`;
  }
}
