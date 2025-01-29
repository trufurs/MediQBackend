import {Request} from '../models/request.js';
import {User} from '../models/user.js';
import {Store} from '../models/store.js';
import {Address} from '../models/address.js';
import mongoose, { Mongoose } from 'mongoose';

import asyncHandler from 'express-async-handler';
import { compare } from 'bcrypt';

// Create a new request
const createRequest = asyncHandler(async (req, res) => {
    const {owner , name , licenseNumber , contact , address } = req.body;
    
    const request = new Request({owner , name , licenseNumber , contact , address });
    const savedRequest = await request.save();
    
    if(savedRequest){
        res.status(201).json(savedRequest);
    }else{
        res.status(400);
        throw new Error('Invalid request data');
    }
    });

// Get all requests
const getRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find().populate('owner address');
    res.status(200).json(requests);
});

// Update a request
const updateRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === 'verified') {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
          const request = await Request.findById(id);
          if (!request) {
              await session.abortTransaction();
              session.endSession();
              return res.status(404).json({ message: "Request not found" });
          }

          const updatedRequest = await Request.findByIdAndUpdate(
              id,
              { status: 'completed' },
              { new: true, session }
          );
          const updatedStore = await Store.create([{
              owner: request.owner,
              name: request.name,
              licenseNumber: request.licenseNumber,
              contact: request.contact,
          }], { session });

          const address = await Address.create([{
              store: updatedStore[0]._id,
              latitude: request.address.latitude,
              longitude: request.address.longitude,
              street: request.address.street,
              city: request.address.city,
              state: request.address.state,
              postalCode: request.address.postalCode,
              country: request.address.country,
          }], { session });

          const updateUser = await User.findByIdAndUpdate(
              request.owner,
              { role: 'store-owner', store_id: updatedStore[0]._id },
              { new: true, session }
          );

          await session.commitTransaction();
          session.endSession();

          return res.status(200).json(updatedRequest);
      } catch (err) {
          await session.abortTransaction();
          session.endSession();
          throw new Error('CastError');
      }
  } else {
      const updatedRequest = await Request.findByIdAndUpdate(
          id,
          status === 'rejected' ? { status: 'cancelled' } : { status: 'pending' },
          { new: true }
      );
      return res.status(200).json(updatedRequest);
  }
});


  export { createRequest, getRequests, updateRequest };