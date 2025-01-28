import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true }, // Pharmacy-specific
  contact: { type: String, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
}, { timestamps: true });

export const Store = mongoose.model('Store', storeSchema);