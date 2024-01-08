import * as mongoose from 'mongoose';

export const ManagerSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: { type: String, unique: true },
  phone: String,
  association: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
});

export interface Manager extends mongoose.Document {
  manager_id: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  association: mongoose.Schema.Types.ObjectId;
}
