import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true }
  },
  createdAt: { type: Date, default: Date.now , Lock: true},
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
