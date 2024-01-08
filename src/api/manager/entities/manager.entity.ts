import * as mongoose from 'mongoose';

export const ManagerSchema = new mongoose.Schema({
  name: String,
  user_name: String,
  password: String,
  phone: String,
  branch_id: mongoose.Types.ObjectId,
});

export interface Manager extends mongoose.Document {
  manager_id: string;
  name: string;
  user_name: string;
  password: string;
  phone: string;
  branch_id: mongoose.Types.ObjectId;
}
