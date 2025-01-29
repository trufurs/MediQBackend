import asyncHandler from 'express-async-handler';
import {Order} from '../models/orders.js';
import mongoose from 'mongoose';
import { inventory } from '../models/inventory.js';

//auth create order
export const createOrderAuth = asyncHandler(async (req, res) => {
  const { seller, medicines, totalItems, status } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = new Order({ store: req.user.store_id, seller, medicines, totalItems, status });
    const savedOrder = await order.save({ session });

    for (const data of medicines) {
      const { medicine_id, quantity, expiry, type } = data;

      if (type === 'new') {
        const inventoryData = new inventory({ store: req.user.store_id, medicine:medicine_id, quantity, expiryDate:expiry, order: savedOrder._id });
        await inventoryData.save({ session });
      } else {
        await inventory.findOneAndUpdate(
          { store: req.user.store_id, medicine:medicine_id },
          { quantity, expiryDate :expiry },
          { new: true, session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedOrder);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

// Auth get orders
export const getOrdersAuth = asyncHandler(async (req, res) => {
  const orders = await Order.find({ store: req.user.store_id }).populate('medicines.medicine_id');
  res.status(200).json(orders);
});


// Dev commands
// Create a new order
export const addOrder = asyncHandler(async (req, res) => {
  const { store, seller, medicines, totalItems, status } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const order = new Order({ store, seller, medicines, totalItems, status });
    const savedOrder = await order.save({ session });

    for (const data of medicines) {
      const { medicine_id, quantity, expiry, type } = data;

      if (type === 'new') {
        const inventory = new Inventory({
          store,
          medicine_id,
          quantity,
          expiryDate: expiry, // Ensure consistent naming
          order: savedOrder._id, // Reference order ID
        });
        await inventory.save({ session });
      } else {
        await Inventory.findOneAndUpdate(
          { store, medicine_id },
          { $inc: { quantity: quantity }, expiryDate: expiry },
          { new: true, session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(savedOrder);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ error: err.message });
  }
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
