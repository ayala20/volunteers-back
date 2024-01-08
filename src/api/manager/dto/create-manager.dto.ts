import { Types } from 'mongoose';

export class CreateManagerDto {
  constructor(
    public name: number,
    public user_name: string,
    public password: Types.ObjectId,
    public phone: string,
    public branch_id: Types.ObjectId,
  ) {}
}
