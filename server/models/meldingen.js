import mongoose from 'mongoose';

const meldingenSchema = new mongoose.Schema(
  {
    escalatorId: {
      type: Number, // Ensure the field name matches the one used in submitFeedback
    },
    status: {
      type: Boolean, // Ensure the type matches the expected Boolean type
      required: true // Add required validation if necessary
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const Melding = mongoose.model('Melding', meldingenSchema);
