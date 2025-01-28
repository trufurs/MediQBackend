import { Schema, model } from 'mongoose';

const requests = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true , unique: true},
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true }, // Pharmacy-specific
    contact: { type: String, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    }, { timestamps: true });

export const Request = model('Request', requests);