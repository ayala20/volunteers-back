import * as mongoose from 'mongoose';

export const VolunteerSchema = new mongoose.Schema({
  full_name: String,
  address: String,
  phone: { type: String, unique: true },
  dateOfBirth: Date,
  id_number: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
});

export interface Volunteer extends mongoose.Document {
  id: string;
  full_name: string;
  address: string;
  phone: string;
  dateOfBirth: Date;
  id_number: string;
  password: string;
  email: string;
}
