import * as mongoose from 'mongoose';
import { StatusAssociation } from '../dto/create-association.dto';

export const AssociationSchema = new mongoose.Schema({
  number: Number,
  name: String,
  address: String,
  email: String,
  phone: String,
  password: String,
  file: String,
  logo_image: String,
  status: { type: String, default: StatusAssociation.NEW },
});

export interface Association extends mongoose.Document {
  id: string;
  number: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  file: string;
  logo_image: string;
}
