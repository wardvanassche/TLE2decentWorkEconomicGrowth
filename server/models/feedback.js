import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  escalatorId: Number,
  status: String,
  timestamp: Date,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
