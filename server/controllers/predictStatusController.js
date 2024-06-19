import brain from 'brain.js';
import { Melding } from '../models/meldingen.js'; // Use the Melding model
import TrainedModel from '../models/modelTraining.js';

const predictStatus = async (req, res) => {
  const { escalatorId } = req.body;

  try {
    console.log("Fetching trained model from database...");
    const modelRecord = await TrainedModel.findOne({ escalatorId });

    if (!modelRecord) {
      return res.status(404).json({ error: 'Model not found for this escalator' });
    }

    const net = new brain.NeuralNetwork().fromJSON(modelRecord.model);

    console.log("Fetching latest feedback...");
    // Assuming the prediction is based on the latest feedback status
    const latestFeedback = await Melding.findOne({ escalatorId }).sort({ timestamp: -1 });

    if (!latestFeedback) {
      return res.status(404).json({ error: 'No feedback data found for this escalator' });
    }

    const input = { broken: latestFeedback.status ? 1 : 0 }; // Assuming status is boolean
    const output = net.run(input);

    // Convert the output to a percentage
    const brokenPercentage = output.broken * 100;

    res.json({ prediction: `${brokenPercentage.toFixed(2)}% chance that is is going to break in the near future` });
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).send({ message: 'Error making prediction', error: error.message });
  }
};

export default predictStatus;
