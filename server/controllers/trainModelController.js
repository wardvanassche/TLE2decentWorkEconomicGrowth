import brain from 'brain.js';
import fetchMeldingData from './fetchMeldingenController.js';
import TrainedModel from '../models/modelTraining.js';

const trainModel = async () => {
  try {
    console.log("Fetching feedback data...");
    const feedbacks = await fetchMeldingData();

    if (!feedbacks || feedbacks.length === 0) {
      console.warn("No feedback data found for training.");
      return;
    }

    console.log("Processing feedback data...");
    const feedbacksByEscalator = feedbacks.reduce((acc, feedback) => {
      if (!acc[feedback.escalatorId]) {
        acc[feedback.escalatorId] = [];
      }
      acc[feedback.escalatorId].push({
        input: { broken: feedback.status ? 1 : 0 },
        output: { broken: feedback.status ? 1 : 0 },
      });
      return acc;
    }, {});

    console.log("Starting model training for each escalator...");
    for (const escalatorId in feedbacksByEscalator) {
      const trainingData = feedbacksByEscalator[escalatorId];

      const net = new brain.NeuralNetwork();
      console.log(`Training model for escalator ${escalatorId}...`);
      net.train(trainingData, {
        iterations: 20000,
        errorThresh: 0.005,
        log: true,
        logPeriod: 100,
      });

      const model = net.toJSON();
      // Save the trained model to the TrainedModel collection
      console.log(`Saving model for escalator ${escalatorId} to database...`);
      await TrainedModel.findOneAndUpdate(
        { escalatorId },
        { escalatorId, model },
        { upsert: true }
      );
      console.log(`Model for escalator ${escalatorId} trained and saved.`);
    }
  } catch (error) {
    console.error("Error during model training process:", error);
    throw new Error("Model training error");
  }
};

const TrainModelsHandler = async (req, res) => {
  try {
    console.log("TrainModelsHandler called...");
    await trainModel();
    res.status(200).send({ message: "Models trained successfully" });
  } catch (error) {
    console.error("Error in TrainModelsHandler:", error);
    res
      .status(500)
      .send({ message: "Error training models", error: error.message });
  }
};

export default TrainModelsHandler;
