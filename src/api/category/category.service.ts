import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = new this.categoryModel({
      category_name: createCategoryDto.category_name,
    });
    const result = await newCategory.save();
    return result;
  }

  async findAll() {
    const categories = await this.categoryModel.find().exec();
    return categories.map((category) => ({
      category_id: category.id,
      category_name: category.category_name,
    }));
  }

  async findCategory(id: string) {
    let category;
    try {
      category = await this.categoryModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Category.');
    }
    if (!category) {
      throw new NotFoundException('Could not find Category.');
    }
    return category;
  }

  async findOne(id: string) {
    const category = await this.findCategory(id);
    return {
      category_id: category.id,
      namcategory_namee: category.category_name,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.findCategory(id);
    if (updateCategoryDto.category_name) {
      updatedCategory.category_name = updateCategoryDto.category_name;
    }
    await updatedCategory.save();
    return `This action updated a #${id} category`;
  }

  async remove(id: string) {
    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Category.');
    }
    return `This action removes a #${id} category`;
  }
}
