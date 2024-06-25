import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  escalatorId: {
    type: Number,
    required: true,
    unique: true
  },
  model: {
    type: Object,
    required: true
  }
});

const TrainedModel = mongoose.model('TrainedModel', modelSchema);
export default TrainedModel;
