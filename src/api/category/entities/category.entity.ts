import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  category_name: String,
});

export interface Category extends mongoose.Document {
  category_id: string;
  category_name: string;
}
