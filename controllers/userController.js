import {User} from '../models/user.js';
import asyncHandler from 'express-async-handler';

// auth Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.passwordHash = undefined;
  res.status(200).json(user);
});

// auth Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  if(!req.body.name || !req.body.email || !req.body.gender || !req.body.phone){
    throw new Error('BadRequestError');
  }
  const user = await User.findByIdAndUpdate(req.user.id ,{
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    phone: req.body.phone
  },{new:true});
  res.status(200).json(user);
});

export { getUserProfile, updateUserProfile };

// Dev controller to create a user
// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { name, email, gender, passwordHash, phone, role } = req.body;

  const user = new User({ name, email, gender, passwordHash, phone, role });
  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get a user
const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    throw new Error('NotFoundError');
  }
});

// Update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
  res.status(200).json(updatedUser);
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);
  res.status(204).send();
});

export {createUser, getUser, getUsers, updateUser, deleteUser };