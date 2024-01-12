import * as mongoose from 'mongoose';

export const FeedbackSchema = new mongoose.Schema({
  date: Date,
  rating: Number,
});

export interface Feedback extends mongoose.Document {
  feedback_id: string;
  date: Date;
  rating: number;
}
