import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Manager } from './entities/manager.entity';
import { Model } from 'mongoose';

@Injectable()
export class ManagerService {
  constructor(@InjectModel('Manager') private managerModel: Model<Manager>) {}

  async create(createManagerDto: CreateManagerDto) {
    const newManager = new this.managerModel(createManagerDto);
    let manager: any;
    try {
      manager = await newManager.save();
    } catch (error) {
      throw new NotFoundException('Email is exist!');
    }
    return {
      name: manager.name,
      password: manager.password,
      email: manager.email,
      phone: manager.phone,
      association: manager.association,
    };
  }

  async findAll() {
    const managers = await this.managerModel
      .find()
      .populate({ path: 'association' })
      .exec();
    return managers.map((manager) => ({
      name: manager.name,
      password: manager.password,
      email: manager.email,
      phone: manager.phone,
      association: manager.association,
    }));
  }

  async signIn(userName: string, password: string) {
    let manager;
    try {
      manager = await this.managerModel.findOne({
        user_name: userName,
        password: password,
      });
    } catch (error) {
      throw new NotFoundException('Could not find Manager.');
    }
    if (!manager) {
      throw new NotFoundException('Could not find Manager.');
    }
    return {
      name: manager.name,
      user_name: manager.user_name,
      password: manager.password,
      phone: manager.phone,
      branch_id: manager.branch_id,
    };
  }

  async findManager(id: string) {
    let manager: any;
    try {
      manager = await this.managerModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Manager.');
    }
    if (!manager) {
      throw new NotFoundException('Could not find Manager.');
    }
    return manager;
  }

  async findOne(id: string) {
    const manager = await this.findManager(id);
    return {
      manager_id: manager.manager_id,
      name: manager.name,
      password: manager.password,
      phone: manager.phone,
      branch_id: manager.branch_id,
    };
  }

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    const updatedManager = await this.findManager(id);
    if (updateManagerDto.name) {
      updatedManager.name = updateManagerDto.name;
    }
    if (updateManagerDto.password) {
      updatedManager.password = updateManagerDto.password;
    }
    if (updateManagerDto.email) {
      updatedManager.email = updateManagerDto.email;
    }
    if (updateManagerDto.phone) {
      updatedManager.phone = updateManagerDto.phone;
    }
    await updatedManager.save();
    return `This action updates a #${id} manager`;
  }

  async remove(id: string) {
    const result = await this.managerModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Manager.');
    }
    return `This action removes a #${id} manager`;
  }
}
