import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },

  // Optional GeoJSON Point field
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'  // not required
    },
    coordinates: {
      type: [Number,Number],   // [longitude, latitude]
      default: [0,0]  // so it's optional
    }
  }
}, { timestamps: true });

// Add 2dsphere index if location exists
addressSchema.index({ location: '2dsphere' });

// Auto-generate location from lat/lng if not set
addressSchema.pre('save', function (next) {
  if (!this.location && this.latitude && this.longitude) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    };
  }
  next();
});

export const Address = model('Address', addressSchema);