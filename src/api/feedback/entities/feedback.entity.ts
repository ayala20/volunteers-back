import * as mongoose from 'mongoose';

export const FeedbackSchema = new mongoose.Schema({
  date: Date,
  rating: Number,
  note: String,
  idFreeActivity: { type: mongoose.Schema.Types.ObjectId, ref: 'FreeActivity' },
});

export interface Feedback extends mongoose.Document {
  feedback_id: string;
  date: Date;
  rating: number;
  note: string;
  idFreeActivity: mongoose.Schema.Types.ObjectId;
}
