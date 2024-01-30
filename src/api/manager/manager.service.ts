/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Manager } from './entities/manager.entity';
import { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { IncorrectPasswordException } from 'src/exceptions/incorrect-password-exception';
import { AssociationService } from '../association/association.service';
import { DataExistsException } from 'src/exceptions/email-exists-exception';
import { CacheService } from 'src/sharedServices/cache.service';
import { MailService } from 'src/mail/mail.service';
import { Exception } from 'handlebars/runtime';

dotenv.config();

@Injectable()
export class ManagerService {
  constructor(@InjectModel('Manager') private managerModel: Model<Manager>,
    private readonly associationService: AssociationService,
    private readonly cacheService: CacheService,
    private readonly mailService: MailService
  ) { }

  async create(createManagerDto: CreateManagerDto) {
    const obj: any = this.associationService.findOne(createManagerDto.association);
    const match: boolean = await bcrypt.compare(createManagerDto.passwordAssociation, (await obj).password);
    if (!match) {
      throw new IncorrectPasswordException("The association's password is incorrect!")
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createManagerDto.password, salt);
    createManagerDto.password = hashPassword;
    const newManager = new this.managerModel(createManagerDto);
    let manager: any;
    try {
      manager = await newManager.save();
    } catch (error) {
      throw new DataExistsException('Data is exists!');
    }
    return {
      id: manager.id,
      name: manager.name,
      password: manager.password,
      email: manager.email,
      phone: manager.phone,
      association: manager.association,
      roleUser: 2,
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

  async signIn(email: string, password: string) {
    let manager: any;
    let match: boolean = false;
    if (email == process.env.MANAGER_EMAIL) {
      match = await bcrypt.compare(password, process.env.MANAGER_PASSWORD);
      if (match) {
        return {
          email: email,
          password: process.env.MANAGER_PASSWORD,
          roleUser: 3,
        };
      }
    }
    try {
      manager = await this.managerModel.findOne({ email });
      if (manager) {
        match = await bcrypt.compare(password, manager.password);
      }
    } catch (error) {
      throw new NotFoundException('Could not find Manager.');
    }
    if (!manager) {
      throw new NotFoundException('Could not find Manager.');
    }
    if (!match) {
      throw new IncorrectPasswordException('Your password is incorrect');
    }
    return {
      id: manager.id,
      name: manager.name,
      password: manager.password,
      email: manager.email,
      phone: manager.phone,
      association: manager.association,
      roleUser: 2,
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
      id: manager.manager_id,
      name: manager.name,
      password: manager.password,
      phone: manager.phone,
      branch_id: manager.branch_id,
    };
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

  async isManagerExistsByEmail(email: string) {
    let manager: any;
    try {
      manager = await this.managerModel.findOne({ email });
    } catch (error) {
      return false;
    }
    if (!manager) {
      return false;
    }
    const hashPassword = this.generateRandomCode(6);
    this.cacheService.set(email, hashPassword);
    this.mailService.sendingAnEmailForForgetPassword(email, hashPassword, manager.name)
    return true;
  }

  async isCodeGood(email: string, password: string) {
    let code = "";
    await this.cacheService.get(email)
      .then(c => {
        code = c
      })
    return code == password;
  }

  async updatePassword(email: string, password: string) {
    const updatedManager: any = await this.managerModel.findOne({ email }).exec();
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    updatedManager.password = hashPassword;
    let manager: any;
    try {
      manager = await updatedManager.save();
    } catch (error) {
      throw new Exception("Somsing worng!");
    }
    if (!manager) {
      throw new Exception("Somsing worng!");
    }
  }

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    const updatedManager = await this.findManager(id);
    if (updateManagerDto.email) {
      updatedManager.email = updateManagerDto.email;
    }
    if (updateManagerDto.phone) {
      updatedManager.phone = updateManagerDto.phone;
    }
    let manager: any;
    try {
      manager = await updatedManager.save();
    } catch (error) {
      throw new DataExistsException('Data is exists!');
    }
    return {
      id: manager.id,
      name: manager.name,
      password: manager.password,
      email: manager.email,
      phone: manager.phone,
      association: manager.association,
      roleUser: 2,
    };
  }

  async remove(id: string) {
    const result = await this.managerModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount < 1) {
      throw new NotFoundException('Could not find Manager.');
    }
    return `This action removes a #${id} manager`;
  }
}
