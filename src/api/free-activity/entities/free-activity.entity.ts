import * as mongoose from 'mongoose';
import { StatusFreeActivity } from '../dto/create-free-activity.dto';

export const FreeActivitySchema = new mongoose.Schema({
  name: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  description: String,
  dateAndTime: Date,
  address: String,
  status: { type: String, default: StatusFreeActivity.WAITING },
});

export interface FreeActivity extends mongoose.Document {
  freeActivity_id: string;
  name: string;
  manager: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId;
  district: mongoose.Schema.Types.ObjectId;
  feedback: mongoose.Schema.Types.ObjectId;
  volunteer: mongoose.Schema.Types.ObjectId;
  description: string;
  dateAndTime: Date;
  address: string;
  status: string;
}
