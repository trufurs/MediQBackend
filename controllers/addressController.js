import asyncHandler from 'express-async-handler';
import {Address} from '../models/address.js';

// Get address by Auth
export const getAddressAuth = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.user.address);
  res.status(200).json(address);
});

//update address by Auth
export const updateAddressAuth = asyncHandler(async (req, res) => {
  const { id } = req.user.address;
  const updatedData = req.body;

  const updatedAddress = await Address.findByIdAndUpdate(id, updatedData, { new: true }); 
  res.status(200).json(updatedAddress);
});

//Get address by filter
export const getAddress = asyncHandler(async (req, res) => {
  const filter = req.query;
  const address = await Address.find(filter);
  res.status(200).json(address);
});

// Create a new address
export const createAddress = asyncHandler(async (req, res) => {
  const { latitude, longitude, street, city, state, postalCode, country } = req.body;

  const address = new Address({ latitude, longitude, street, city, state, postalCode, country });
  const savedAddress = await address.save();

  res.status(201).json(savedAddress);
});

// Get all addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find();
  res.status(200).json(addresses);
});

// Update an address
export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedAddress = await Address.findByIdAndUpdate(id, updatedData, { new: true });
  res.status(200).json(updatedAddress);
});

// Delete an address
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Address.findByIdAndDelete(id);
  res.status(204).send();
});
