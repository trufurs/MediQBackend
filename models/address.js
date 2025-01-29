import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
  }, { timestamps: true });

export const Address = model('Address', addressSchema);
