import  {Inventory}  from '../models/inventory.js';
import asyncHandler from 'express-async-handler';


// Create a new inventory item
export const createInventory = asyncHandler(async (req, res) => {
  const { store, medicine, quantity, expiryDate, order } = req.body;

  const inventory = new Inventory({ store, medicine, quantity, expiryDate, order });
  const savedInventory = await inventory.save();

  res.status(201).json(savedInventory);
});

// Get all inventory items
export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().populate('store medicine order');
  res.status(200).json(inventory);
});

// Update an inventory item
export const updateInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedInventory = await Inventory.findByIdAndUpdate(id, updatedData, { new: true });
  res.status(200).json(updatedInventory);
});

// Delete an inventory item
export const deleteInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Inventory.findByIdAndDelete(id);
  res.status(204).send();
});
