import * as mongoose from 'mongoose';

export const VolunteerSchema = new mongoose.Schema({
  full_name: String,
  address: String,
  phone: String,
  dateOfBirth: Date,
  id_number: String,
  password: String,
});

export interface Volunteer extends mongoose.Document {
  id: string;
  full_name: string;
  address: string;
  phone: string;
  dateOfBirth: Date;
  id_number: string;
  password: string;
}
