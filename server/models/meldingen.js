import mongoose from 'mongoose';

const meldingenSchema = new mongoose.Schema(
  {
    liftID: {
      type: Number,
      required: true,
    },
    escelatorID: {
      type: Number,
    },
    defect: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

export const Melding = mongoose.model('Melding', meldingenSchema);