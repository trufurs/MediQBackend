import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import { inventory } from '../models/inventory.js';

// Create a new order
export const addOrder = asyncHandler(async (req, res) => {
  const { store, seller, medicines, totalItems, status } = req.body;
  const session = mongoose.startSession();
  session.startSession();
  try {
    const order = new Order({ store, seller, medicines, totalItems, status });
    const savedOrder = await order.save();

    medicines.forEach(async (data) => {
      const { medicine_id, quantity, expiary, type} = data;
      if(type === 'new'){
        const inventory = new Inventory({ store, medicine_id, quantity, expiryDate, order });
        await inventory.save();
      } else {
        const updateInventory = await inventory.findOneAndUpdate(
          {store, medicine_id},
          { quantity: quantity , expiryDate: expiary }, 
          { new: true });  
      }
    });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw new Error('Invalid request data', err);
  }
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
