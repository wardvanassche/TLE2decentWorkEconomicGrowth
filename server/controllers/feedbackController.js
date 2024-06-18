import Feedback from '../models/feedback.js';
import brain from 'brain.js';
import fs from 'fs';

// Function to fetch feedback data
const fetchFeedbackData = async () => {
  try {
    return await Feedback.find({});
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    throw new Error('Database fetch error');
  }
};

// Function to train the model
const trainModel = async () => {
  try {
    const feedbacks = await fetchFeedbackData();

    if (!feedbacks || feedbacks.length === 0) {
      console.warn('No feedback data found for training.');
      return;
    }

    const feedbacksByEscalator = feedbacks.reduce((acc, feedback) => {
      if (!acc[feedback.escalatorId]) {
        acc[feedback.escalatorId] = [];
      }
      acc[feedback.escalatorId].push({
        input: { broken: feedback.status === 'broken' ? 1 : 0 },
        output: { broken: feedback.status === 'broken' ? 1 : 0 },
      });
      return acc;
    }, {});

    for (const escalatorId in feedbacksByEscalator) {
      const trainingData = feedbacksByEscalator[escalatorId];

      const net = new brain.NeuralNetwork();
      net.train(trainingData, {
        iterations: 20000,
        errorThresh: 0.005,
        log: true,
        logPeriod: 100,
      });

      const model = net.toJSON();
      fs.writeFileSync(`./model_${escalatorId}.json`, JSON.stringify(model));
      console.log(`Model for escalator ${escalatorId} trained and saved.`);
    }
  } catch (error) {
    console.error('Error training model:', error);
    throw new Error('Model training error');
  }
};

// Controller functions
export const submitFeedback = async (req, res) => {
  const { escalatorId, status } = req.body;
  const timestamp = new Date();

  const feedback = new Feedback({ escalatorId, status, timestamp });
  console.log(feedback);
  try {
    await feedback.save();
    res.status(201).send({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).send({ message: 'Error submitting feedback', error: error.message });
  }
};

export const trainModels = async (req, res) => {
  try {
    await trainModel();
    res.status(200).send({ message: 'Models trained successfully' });
  } catch (error) {
    console.error('Error training models:', error);
    res.status(500).send({ message: 'Error training models', error: error.message });
  }
};
