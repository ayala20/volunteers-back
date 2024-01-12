import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFreeActivityDto } from './dto/create-free-activity.dto';
import { UpdateFreeActivityDto } from './dto/update-free-activity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FreeActivity } from './entities/free-activity.entity';
import { Model } from 'mongoose';

@Injectable()
export class FreeActivityService {
  constructor(
    @InjectModel('FreeActivity') private freeActivityModel: Model<FreeActivity>,
  ) {}

  async create(createFreeActivityDto: CreateFreeActivityDto) {
    debugger;
    const newFreeActivity = new this.freeActivityModel(createFreeActivityDto);
    const result = await newFreeActivity.save();
    return result.id;
  }

  async findAll() {
    const freeActivities = await this.freeActivityModel.find().exec();
    return freeActivities;
  }

  async findAllRequest() {
    const freeActivities = await this.freeActivityModel
      .find({ status: 'REQUEST' })
      .exec();
    return freeActivities;
  }

  async filterFreeActivitiesByDistrictAndCategory(
    districtId: string,
    categoryId: string,
  ) {
    debugger;
    let objd;
    let objc;
    if (districtId != '1') {
      objd = { district: districtId };
    }
    if (categoryId != '1') {
      objc = { category: categoryId };
    }
    const object = { ...objd, ...objc, status: 'WAITING' };
    const freeActivities = await this.freeActivityModel
      .find(object)
      .populate({ path: 'district' })
      .populate({ path: 'category' })
      .populate({
        path: 'manager',
        populate: {
          path: 'association',
        },
      })
      .exec();
    return freeActivities;
  }

  async findFreeActivity(id: string) {
    let freeActivity: any;
    try {
      freeActivity = await this.freeActivityModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Feedback.');
    }
    if (!freeActivity) {
      throw new NotFoundException('Could not find Feedback.');
    }
    return freeActivity;
  }

  async findOne(id: string) {
    const freeActivit = await this.findFreeActivity(id);
    return freeActivit;
  }

  async update(id: string, updateFreeActivityDto: UpdateFreeActivityDto) {
    const updatedFreeActivity = await this.findFreeActivity(id);
    if (updateFreeActivityDto.address) {
      updatedFreeActivity.address = updateFreeActivityDto.address;
    }
    if (updateFreeActivityDto.name) {
      updatedFreeActivity.name = updateFreeActivityDto.name;
    }
    if (updateFreeActivityDto.category) {
      updatedFreeActivity.category = updateFreeActivityDto.category;
    }
    if (updateFreeActivityDto.dateAndTime) {
      updatedFreeActivity.dateAndTime = updateFreeActivityDto.dateAndTime;
    }
    if (updateFreeActivityDto.status) {
      updatedFreeActivity.status = updateFreeActivityDto.status;
    }
    if (updateFreeActivityDto.volunteer) {
      updatedFreeActivity.volunteer = updateFreeActivityDto.volunteer;
    }
    await updatedFreeActivity.save();
    return `This action updates a #${id} freeActivity`;
  }

  async remove(id: string) {
    const result = await this.freeActivityModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find FreeActivity.');
    }
    return `This action removes a #${id} freeActivity`;
  }
}
