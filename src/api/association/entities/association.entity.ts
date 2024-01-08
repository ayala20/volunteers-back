import * as mongoose from 'mongoose';

export const AssociationSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  phone: String,
  password: String,
  file: String,
  logo_image: String,
  is_approved: Boolean,
});

export interface Association extends mongoose.Document {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  file: string;
  logo_image: string;
}
