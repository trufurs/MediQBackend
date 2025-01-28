import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  }, { timestamps: true });

const Address = model('Address', addressSchema);
