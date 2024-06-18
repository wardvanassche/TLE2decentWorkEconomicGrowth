import mongoose from 'mongoose';

const meldingenSchema = new mongoose.Schema(
  {
    liftId: {
      type: Number,
      required: true,
    },
    escelatorId: {
      type: Number,
    },
    status: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

export const Melding = mongoose.model('Melding', meldingenSchema);