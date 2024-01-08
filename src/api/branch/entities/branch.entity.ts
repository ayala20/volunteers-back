import * as mongoose from 'mongoose';

export const BranchSchema = new mongoose.Schema({
  branch_name: String,
  branch_number: Number,
  address: String,
  district_id: mongoose.Types.ObjectId,
});

export interface Branch extends mongoose.Document {
  branch_id: string;
  branch_name: string;
  branch_number: number;
  address: string;
  district_id: mongoose.Types.ObjectId;
}
