import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    seller: { type: String},
    medicines: [{
      medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
      quantity: { type: Number, required: true },
      expiary: {type:Date, required:true },
      price: { type: Number, required: true }
    }],
    
    totalItems: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'processed', 'completed', 'cancelled'], default: 'pending' },
  }, { timestamps: true });

  export const Order = model('Order', orderSchema);