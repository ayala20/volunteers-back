import { Schema } from 'mongoose';

export class CreateManagerDto {
  constructor(
    public name: number,
    public user_name: string,
    public password: string,
    public phone: string,
    public email: string,
    public association: Schema.Types.ObjectId,
  ) {}
}
