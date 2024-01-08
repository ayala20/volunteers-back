import { Types } from 'mongoose';

export class CreateBranchDto {
  constructor(
    public branch_name: string,
    public branch_number: number,
    public address: string,
    public district_id: Types.ObjectId,
  ) {}
}
