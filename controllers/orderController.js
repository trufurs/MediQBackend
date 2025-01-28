import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  const { store, seller, medicines, totalItems, status } = req.body;

  const order = new Order({ store, seller, medicines, totalItems, status });
  const savedOrder = await order.save();

  res.status(201).json(savedOrder);
});

// Get all orders
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('store medicines.medicine');
  res.status(200).json(orders);
});

// Update an order
export const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, { new: true });
  res.status(200).json(updatedOrder);
});

// Delete an order
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Order.findByIdAndDelete(id);
  res.status(204).send();
});
