import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  passwordHash: { type: String, required: true },
  phone: { type: Number, required: true },
  role: { type: String, enum: ['admin', 'store-owner', 'customer'],default: 'customer'}, // Role-based access
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store',required: false },
}, { timestamps: true ,strict: false});

export const User = mongoose.model('User', userSchema);
