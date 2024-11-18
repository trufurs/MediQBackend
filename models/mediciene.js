import { Schema, model } from 'mongoose';

const medicationSchema = new Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    form: { type: String, required: true }, // e.g., tablet, liquid
    indications: { type: String }, // Conditions treated
    administrationRoute: { type: String }, // e.g., oral, IV
    frequency: { type: String, required: true }, // e.g., daily
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    sideEffects: [{ type: String }],
    contraindications: [{ type: String }],
    precautions: [{ type: String }],
    storageInstructions: { type: String },
    prescribedBy: { type: String }, // Doctor's name
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

 export const Medication = model('Medication', medicationSchema);