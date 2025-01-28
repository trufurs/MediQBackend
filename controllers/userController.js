import {User} from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// Create a new user
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, gender, passwordHash, phone, role } = req.body;

  const user = new User({ name, email, gender, passwordHash, phone, role });
  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

// Get all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Update a user
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
  res.status(200).json(updatedUser);
});

// Delete a user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);
  res.status(204).send();
});
