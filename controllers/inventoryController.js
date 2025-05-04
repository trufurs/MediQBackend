import  {inventory}  from '../models/inventory.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Address } from '../models/address.js';
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
  const result = await inventory.findOneAndDelete({_id:id , store:req.user.store_id});
  if (!result) {
    res.status(404);
    throw new Error('Inventory item not found');
  }
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

export const getStoresWithMedicineNearby = asyncHandler(async (req, res) => {
  const { medicine, lat, lng, radius = 5 } = req.query;

  console.log('Medicine:', medicine);
  console.log('Latitude:', lat);
  console.log('Longitude:', lng);
  console.log('Radius:', radius);

  if (!medicine || !lat || !lng) {
      return res.status(400).json({ message: 'medicine, lat, and lng are required' });
  }

  try {
      const fullInventory = await Address.aggregate([
          {
              $geoNear: {
                  near: {
                      type: 'Point',
                      coordinates: [parseFloat(lng), parseFloat(lat)]
                  },
                  distanceField: 'distance', // Add distance to the result
                  maxDistance: radius * 1000 , // Convert radius from km to meters
                  spherical: true, // Enable spherical calculations
                  query: {} // Initial query can be empty
              }
          },
          {
              $lookup: {
                  from: 'inventories', // Join with the Inventory collection
                  localField: 'store',
                  foreignField: 'store',
                  as: 'inventoryData',
              },
          },
           { $unwind: {
                  path: '$inventoryData',
                  preserveNullAndEmptyArrays: false // Ensure only stores with inventory are returned
              }},
          {
              $match: {
                  'inventoryData.medicine': new mongoose.Types.ObjectId(medicine),
                  'inventoryData.quantity': { $gt: 0 }
              }
          },
          {
              $project: {
                  _id: 0,
                  store: 1,
                  medicine: '$inventoryData.medicine',
                  quantity: '$inventoryData.quantity',
                  expiryDate: '$inventoryData.expiryDate',
                  distance: 1,
                  'storeAddress.street': '$street',
                  'storeAddress.city': '$city',
                  'storeAddress.state': '$state',
                  'storeAddress.postalCode': '$postalCode',
                  'storeAddress.country': '$country',
                  'storeAddress.location': '$location',
              },
          },
      ]);

      console.log('Full Inventory:', fullInventory);

      if (fullInventory.length === 0) {
          return res.status(404).json({ message: 'No nearby stores found with this medicine' });
      }

      res.status(200).json(fullInventory);
  } catch (error) {
      console.error('Error in getStoresWithMedicineNearby:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message }); // Include error message
  }
});

