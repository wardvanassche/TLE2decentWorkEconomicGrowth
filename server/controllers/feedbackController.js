import Feedback from '../models/meldingen.js';
import brain from 'brain.js';
import fs from 'fs';

// Function to fetch feedback data
const fetchFeedbackData = async () => {
  return await Feedback.find({});
};

// Function to train the model
const trainModel = async () => {
  const feedbacks = await fetchFeedbackData();

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
  }

  console.log('Models trained and saved.');
};

// Controller functions
export const submitFeedback = async (req, res) => {
  const { escalatorId, status } = req.body;
  const timestamp = new Date();

  const feedback = new Feedback({ escalatorId, status, timestamp });

  try {
    await feedback.save();
    res.status(201).send('Feedback submitted');
  } catch (error) {
    res.status(500).send('Error submitting feedback');
  }
};

export const trainModels = async (req, res) => {
  try {
    await trainModel();
    res.status(200).send('Models trained successfully');
  } catch (error) {
    res.status(500).send('Error training models');
  }
};
