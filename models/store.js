const storeOwnerSchema = new mongoose.Schema({
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true }
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true }
    },
    storeType: { type: String, required: true }, // e.g., retail pharmacy
    licenseInfo: {
      licenseNumber: { type: String, required: true },
      expirationDate: { type: Date, required: true }
    },
    hoursOfOperation: {
      monday: { type: String },
      tuesday: { type: String },
      wednesday: { type: String },
      thursday: { type: String },
      friday: { type: String },
      saturday: { type: String },
      sunday: { type: String }
    },
    paymentMethods: [{ type: String }], // e.g., cash, credit
    deliveryOptions: { type: String },
    website: { type: String },
    socialMedia: [{ platform: String, link: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  