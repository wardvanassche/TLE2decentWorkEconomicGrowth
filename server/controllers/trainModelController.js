import brain from 'brain.js';
import fs from 'fs';
import fetchMeldingData from './fetchMeldingenController.js';

const trainModel = async () => {
  try {
    const feedbacks = await fetchMeldingData();

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

const TrainModelsHandler = async (req, res) => {
  try {
    await trainModel();
    res.status(200).send({ message: 'Models trained successfully' });
  } catch (error) {
    console.error('Error training models:', error);
    res.status(500).send({ message: 'Error training models', error: error.message });
  }
};

export default TrainModelsHandler;
