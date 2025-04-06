import  {inventory}  from '../models/inventory.js';
import asyncHandler from 'express-async-handler';
// Auth create inventory
// @desc    Create a new inventory item
// @route   POST /api/inventory
// @access  Private
export const createinventoryAuth = asyncHandler(async (req, res) => {
  const {medicine, quantity, expiryDate, order } = req.body;

  const data = new inventory({ store: req.user.store_id, medicine, quantity, expiryDate, order });
  const savedinventory = await data.save();

  res.status(201).json(savedinventory);
});

// Auth get inventory
// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
export const getinventoryAuth = asyncHandler(async (req, res) => {
  const data = await inventory.find({ store: req.user.store_id }).populate('medicine');
  res.status(200).json(data);
});

// Auth update inventory
// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
// @access  Private
export const updateinventoryAuth = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedinventory = await inventory.findByIdAndUpdate({_id:id , store:req.user.store_id}, updatedData, { new: true });
  res.status(200).json(updatedinventory);
});

// Auth delete inventory
// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
export const deleteinventoryAuth = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await inventory.findByIdAndDelete(id);
  res.status(204).send();
});

// Dev commands
// Create a new inventory item
export const createinventory = asyncHandler(async (req, res) => {
  const { store, medicine, quantity, expiryDate, order } = req.body;

  const data = new inventory({ store, medicine, quantity, expiryDate, order });
  const savedinventory = await data.save();

  res.status(201).json(savedinventory);
});

// Get all inventory items
export const getinventory = asyncHandler(async (req, res) => {
  const data = await inventory.find().populate('store medicine order');
  res.status(200).json(data);
});

// Update an inventory item
export const updateinventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedinventory = await inventory.findByIdAndUpdate(id, updatedData, { new: true });
  res.status(200).json(updatedinventory);
});

// Delete an inventory item
export const deleteinventory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await inventory.findByIdAndDelete(id);
  res.status(204).send();
});
