/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFreeActivityDto } from './dto/create-free-activity.dto';
import { UpdateFreeActivityDto } from './dto/update-free-activity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FreeActivity } from './entities/free-activity.entity';
import mongoose, { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class FreeActivityService {
  constructor(
    @InjectModel('FreeActivity') private freeActivityModel: Model<FreeActivity>,
    private mailService: MailService,
  ) { }

  async create(createFreeActivityDto: CreateFreeActivityDto) {
    const newFreeActivity = new this.freeActivityModel(createFreeActivityDto);
    const result = await newFreeActivity.save();
    return result.id;
  }

  async findAll() {
    const freeActivities = await this.freeActivityModel.find().exec();
    return freeActivities;
  }

  async findAllRequestByManagerAndStatus(managerId: string, statuses: string) {
    const arr = statuses.split(',');
    let freeActivities = []
    try {
      freeActivities = await this.freeActivityModel
        .find({ status: { $in: arr }, manager: managerId })
        .populate({ path: 'volunteer' })
        .populate({ path: 'category' })
        .exec();
    } catch (error) {
      return freeActivities;
    }
    return freeActivities.map((freeActivitie) => ({
      freeActivity_id: freeActivitie.id,
      name: freeActivitie.name,
      manager: freeActivitie.manager,
      category: freeActivitie.category,
      district: freeActivitie.district,
      volunteer: freeActivitie.volunteer,
      description: freeActivitie.description,
      dateAndTime: freeActivitie.dateAndTime,
      address: freeActivitie.address,
      status: freeActivitie.status,
    }));
  }

  async findAllRequestByVolunteerAndStatus(
    volunteerId: string,
    statuses: string,
  ) {
    const arr = statuses.split(',');
    let freeActivities = []
    try {
      freeActivities = await this.freeActivityModel
        .find({ status: { $in: arr }, volunteer: volunteerId })
        .populate({
          path: 'manager',
          populate: {
            path: 'association',
          },
        })
        .populate({ path: 'category' })
        .exec();
    } catch (error) {
      return freeActivities;
    }
    return this.fromArrSchemaToRegular(freeActivities);
  }

  async findAllRequestByAssociation(
    associationId: string,
  ) {
    const freeActivities = await this.freeActivityModel.aggregate([
      {
        $lookup: {
          from: 'managers',
          localField: 'manager',
          foreignField: '_id',
          as: 'manager',
        },
      },
      {
        $unwind: '$manager',
      },
      {
        $match: {
          'manager.association': new mongoose.Types.ObjectId(
            associationId,
          ),
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $lookup: {
          from: 'volunteers',
          localField: 'volunteer',
          foreignField: '_id',
          as: 'volunteer',
        },
      },
      {
        $unwind: '$volunteer',
      },
    ]);
    return freeActivities;
  }

  async fromArrSchemaToRegular(freeActivities: any[]) {
    return freeActivities.map((freeActivitie) => ({
      freeActivity_id: freeActivitie.id,
      name: freeActivitie.name,
      manager: freeActivitie.manager,
      category: freeActivitie.category,
      district: freeActivitie.district,
      volunteer: freeActivitie.volunteer,
      description: freeActivitie.description,
      dateAndTime: freeActivitie.dateAndTime,
      address: freeActivitie.address,
      status: freeActivitie.status,
    }));
  }

  async filterFreeActivitiesByDistrictAndCategory(districtIds: string, categoryIds: string) {
    const districtIdsArr = districtIds.split(',');
    const categoryIdsArr = categoryIds.split(',');
    let objd, objc;
    if (districtIdsArr[0] != '1') {
      objd = { district: { $in: districtIdsArr } };
    }
    if (categoryIdsArr[0] != '1') {
      objc = { category: { $in: categoryIdsArr } };
    }
    const object = { ...objd, ...objc, status: 'WAITING', dateAndTime: { $gt: new Date() }};
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
    return this.fromArrSchemaToRegular(freeActivities);
  }

  async findFreeActivity(id: string) {
    let freeActivity: any;
    try {
      freeActivity = (await this.freeActivityModel.findById(id))
        .populate({ path: 'volunteer' });
    } catch (error) {
      throw new NotFoundException('Could not find FreeActivity.');
    }
    if (!freeActivity) {
      throw new NotFoundException('Could not find FreeActivity.');
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

  async updateStatus(freeActivityId: string, userId: string, status: string) {
    const updatedFreeActivity = await this.findFreeActivity(freeActivityId);
    updatedFreeActivity.status = status;
    if (userId != '1') {
      updatedFreeActivity.volunteer = userId;
    } else if (status != 'DONE') {
      this.mailService.sendingAnEmailToAVolunteer(updatedFreeActivity.volunteer.email, updatedFreeActivity.name, updatedFreeActivity.volunteer.full_name, status)
    }
    await updatedFreeActivity.save();
    return `This action updates a #${freeActivityId} freeActivity`;
  }

  async remove(id: string) {
    const result = await this.freeActivityModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find FreeActivity.');
    }
    return `This action removes a #${id} freeActivity`;
  }

}
