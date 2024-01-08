import * as mongoose from 'mongoose';

export const DistrictSchema = new mongoose.Schema({
  district_name: String,
});

export interface District extends mongoose.Document {
  district_id: string;
  district_name: string;
}
