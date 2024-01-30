/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel('Feedback') private feedbackModel: Model<Feedback>,
  ) { }

  async create(createFeedbackDto: CreateFeedbackDto) {
    const newFeedback = new this.feedbackModel(createFeedbackDto);
    const result = await newFeedback.save();
    return result.id;
  }

  async findAll() {
    const feedbacks = await this.feedbackModel.aggregate([
      {
        $lookup: {
          from: 'freeactivities',
          localField: 'idFreeActivity',
          foreignField: '_id',
          as: 'idFreeActivity',
        },
      },
      {
        $unwind: '$idFreeActivity',
      },
      {
        $lookup: {
          from: 'managers',
          localField: 'idFreeActivity.manager',
          foreignField: '_id',
          as: 'manager'
        }
      },
      {
        $unwind: '$manager'
      },
      {
        $lookup: {
          from: 'associations',
          localField: 'manager.association',
          foreignField: '_id',
          as: 'association'
        }
      },
      {
        $unwind: '$association'
      },
      {
        $lookup: {
          from: 'volunteers',
          localField: 'idFreeActivity.volunteer',
          foreignField: '_id',
          as: 'volunteer'
        }
      },
      {
        $unwind: '$volunteer'
      },
      {
        $sort: { date: -1 }
      }
    ]);
    return feedbacks;
  }

  async findFeedback(id: string) {
    let feedback: any;
    try {
      feedback = await this.feedbackModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Feedback.');
    }
    if (!feedback) {
      throw new NotFoundException('Could not find Feedback.');
    }
    return feedback;
  }

  async findOne(id: string) {
    const feedback = await this.findFeedback(id);
    return {
      district_id: feedback.id,
      date: feedback.date,
      rating: feedback.rating,
      note: feedback.note,
    };
  }

  async getFeedbackByVolunteerId(volunteerId: string) {
    const feedbacks = await this.feedbackModel.aggregate([
      {
        $lookup: {
          from: 'freeactivities',
          localField: 'idFreeActivity',
          foreignField: '_id',
          as: 'idFreeActivity',
        },
      },
      {
        $unwind: '$idFreeActivity',
      },
      {
        $match: {
          'idFreeActivity.volunteer': new mongoose.Types.ObjectId(volunteerId),
        },
      },
      {
        $lookup: {
          from: 'managers',
          localField: 'idFreeActivity.manager',
          foreignField: '_id',
          as: 'manager'
        }
      },
      {
        $unwind: '$manager'
      },
      {
        $lookup: {
          from: 'associations',
          localField: 'manager.association',
          foreignField: '_id',
          as: 'association'
        }
      },
      {
        $unwind: '$association'
      },
      {
        $lookup: {
          from: 'volunteers',
          localField: 'idFreeActivity.volunteer',
          foreignField: '_id',
          as: 'volunteer'
        }
      },
      {
        $unwind: '$volunteer'
      },
      {
        $sort: { date: -1 }
      }
    ]);
    return feedbacks;
  }

  async getFeedbackByManagerId(managerId: string) {
    const feedbacks = await this.feedbackModel.aggregate([
      {
        $lookup: {
          from: 'freeactivities',
          localField: 'idFreeActivity',
          foreignField: '_id',
          as: 'idFreeActivity',
        },
      },
      {
        $unwind: '$idFreeActivity',
      },
      {
        $match: {
          'idFreeActivity.manager': new mongoose.Types.ObjectId(managerId),
        },
      },
      {
        $lookup: {
          from: 'managers',
          localField: 'idFreeActivity.manager',
          foreignField: '_id',
          as: 'manager'
        }
      },
      {
        $unwind: '$manager'
      },
      {
        $lookup: {
          from: 'associations',
          localField: 'manager.association',
          foreignField: '_id',
          as: 'association'
        }
      },
      {
        $unwind: '$association'
      },
      {
        $lookup: {
          from: 'volunteers',
          localField: 'idFreeActivity.volunteer',
          foreignField: '_id',
          as: 'volunteer'
        }
      },
      {
        $unwind: '$volunteer'
      },
      {
        $sort: { date: -1 }
      }
    ]);
    return feedbacks;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    const updatedFeedback = await this.findFeedback(id);
    if (updateFeedbackDto.date) {
      updatedFeedback.date = updateFeedbackDto.date;
    }
    if (updateFeedbackDto.rating) {
      updatedFeedback.rating = updateFeedbackDto.rating;
    }
    await updatedFeedback.save();
    return `This action updates a #${id} feedback`;
  }

  async remove(id: string) {
    const result = await this.feedbackModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Feedback.');
    }
    return `This action removes a #${id} feedback`;
  }
}
