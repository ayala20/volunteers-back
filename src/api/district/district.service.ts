import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District } from './entities/district.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel('District') private districtModel: Model<District>,
  ) {}

  async create(createDistrictDto: CreateDistrictDto) {
    const newDistrict = new this.districtModel({
      district_name: createDistrictDto.district_name,
    });
    const result = await newDistrict.save();
    return result.id;
  }

  async findAll() {
    const districts = await this.districtModel.find().exec();
    return districts.map((district) => ({
      district_id: district.id,
      district_name: district.district_name,
    }));
  }

  async findDistrict(id: string) {
    let district;
    try {
      district = await this.districtModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find District.');
    }
    if (!district) {
      throw new NotFoundException('Could not find District.');
    }
    return district;
  }

  async findOne(id: string) {
    const district = await this.findDistrict(id);
    return {
      district_id: district.id,
      full_name: district.district_name,
    };
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    const updatedDistrict = await this.findDistrict(id);
    if (updateDistrictDto.district_name) {
      updatedDistrict.district_name = updateDistrictDto.district_name;
    }
    await updatedDistrict.save();
    return `This action updates a #${id} district`;
  }

  async remove(id: string) {
    const result = await this.districtModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find District.');
    }
    return `This action removes a #${id} district`;
  }
}
