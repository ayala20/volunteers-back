import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Volunteer } from './entities/volunteer.entity';
import * as bcrypt from 'bcrypt';
import { IncorrectPasswordException } from 'src/exceptions/incorrect-password-exception';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectModel('Volunteer') private volunteerModel: Model<Volunteer>,
  ) {}

  async create(createVolunteerDto: CreateVolunteerDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createVolunteerDto.password, salt);
    createVolunteerDto.password = hashPassword;
    const newVolunteer = new this.volunteerModel(createVolunteerDto);
    const volunteer = await newVolunteer.save();
    return {
      id: volunteer.id,
      full_name: volunteer.full_name,
      address: volunteer.address,
      phone: volunteer.phone,
      dateOfBirth: volunteer.dateOfBirth,
      id_number: volunteer.id_number,
      password: volunteer.password,
      roleUser: 1,
    };
  }

  async signIn(idNumber: string, password: string) {
    let volunteer;
    let match: boolean;
    try {
      volunteer = await this.volunteerModel.findOne({
        id_number: idNumber,
      });
      if (volunteer) {
        match = await bcrypt.compare(password, volunteer.password);
      }
    } catch (error) {
      throw new NotFoundException('Could not find Volunteer.');
    }
    if (!volunteer) {
      throw new NotFoundException('Could not find Volunteer.');
    }
    if (!match) {
      throw new IncorrectPasswordException('Your password is incorrect');
    }
    return {
      id: volunteer.id,
      full_name: volunteer.full_name,
      address: volunteer.address,
      phone: volunteer.phone,
      dateOfBirth: volunteer.dateOfBirth,
      id_number: volunteer.id_number,
      password: volunteer.password,
      roleUser: 1,
    };
  }

  async findAll() {
    const volunteers = await this.volunteerModel.find().exec();
    return volunteers.map((volunteer) => ({
      id: volunteer.id,
      full_name: volunteer.full_name,
      address: volunteer.address,
      phone: volunteer.phone,
      dateOfBirth: volunteer.dateOfBirth,
      id_number: volunteer.id_number,
      password: volunteer.password,
    }));
  }

  async findVolunteer(id: string) {
    let volunteer;
    try {
      volunteer = await this.volunteerModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Volunteer.');
    }
    if (!volunteer) {
      throw new NotFoundException('Could not find Volunteer.');
    }
    return volunteer;
  }

  async findOne(id: string) {
    const volunteer = await this.findVolunteer(id);
    return {
      id: volunteer.id,
      full_name: volunteer.full_name,
      address: volunteer.address,
      phone: volunteer.phone,
      dateOfBirth: volunteer.dateOfBirth,
      id_number: volunteer.id_number,
      password: volunteer.password,
    };
  }

  async update(id: string, updateVolunteerDto: UpdateVolunteerDto) {
    const updatedVolunteer = await this.findVolunteer(id);
    if (updateVolunteerDto.full_name) {
      updatedVolunteer.full_name = updateVolunteerDto.full_name;
    }
    if (updateVolunteerDto.address) {
      updatedVolunteer.address = updateVolunteerDto.address;
    }
    if (updateVolunteerDto.phone) {
      updatedVolunteer.phone = updateVolunteerDto.phone;
    }
    if (updateVolunteerDto.dateOfBirth) {
      updatedVolunteer.dateOfBirth = updateVolunteerDto.dateOfBirth;
    }
    if (updateVolunteerDto.id_number) {
      updatedVolunteer.id_number = updateVolunteerDto.id_number;
    }
    if (updateVolunteerDto.password) {
      updatedVolunteer.passwword = updateVolunteerDto.password;
    }
    await updatedVolunteer.save();
    return `This action updates a #${id} volunteer`;
  }

  async remove(id: string) {
    const result = await this.volunteerModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Volunteer.');
    }
    return `This action removes a #${id} volunteer`;
  }
}
