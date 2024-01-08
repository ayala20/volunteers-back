import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BranchService {
  constructor(@InjectModel('Branch') private branchModel: Model<Branch>) {}

  async create(createBranchDto: CreateBranchDto) {
    const newBranch = new this.branchModel({
      branch_name: createBranchDto.branch_name,
      branch_number: createBranchDto.branch_number,
      address: createBranchDto.address,
      district_id: createBranchDto.district_id,
    });
    const result = await newBranch.save();
    return result.id;
  }

  async findAll() {
    const branches = await this.branchModel.find().exec();
    return branches.map((branch) => ({
      id: branch.id,
      branch_name: branch.branch_name,
      branch_number: branch.branch_number,
      address: branch.address,
      district_id: branch.district_id,
    }));
  }

  async findBranch(id: string) {
    let branch;
    try {
      branch = await this.branchModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Branch.');
    }
    if (!branch) {
      throw new NotFoundException('Could not find Branch.');
    }
    return branch;
  }

  async findOne(id: string) {
    const branch = await this.findBranch(id);
    return {
      branch_id: branch.id,
      branch_name: branch.branch_name,
      branch_number: branch.branch_number,
      address: branch.address,
      district_id: branch.district_id,
    };
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const updatedBranch = await this.findBranch(id);
    if (updateBranchDto.address) {
      updatedBranch.address = updateBranchDto.address;
    }
    if (updateBranchDto.branch_name) {
      updatedBranch.branch_name = updateBranchDto.branch_name;
    }
    if (updateBranchDto.branch_number) {
      updatedBranch.branch_number = updateBranchDto.branch_number;
    }
    if (updateBranchDto.district_id) {
      updatedBranch.district_id = updateBranchDto.district_id;
    }
    await updatedBranch.save();
    return `This action updates a #${id} branch`;
  }

  async remove(id: string) {
    const result = await this.branchModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Branch.');
    }
    return `This action removes a #${id} branch`;
  }
}
