import fs from 'fs';
import brain from 'brain.js';
import Feedback from '../models/feedback.js';

const predictStatus = async (req, res) => {
  const { escalatorId } = req.body;

  try {
    const modelPath = `./model_${escalatorId}.json`;
    if (!fs.existsSync(modelPath)) {
      return res.status(404).json({ error: 'Model not found for this escalator' });
    }

    const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
    const net = new brain.NeuralNetwork().fromJSON(modelData);

    // Assuming the prediction is based on the latest feedback status
    const latestFeedback = await Feedback.findOne({ escalatorId }).sort({ timestamp: -1 });
    if (!latestFeedback) {
      return res.status(404).json({ error: 'No feedback data found for this escalator' });
    }

    const input = { broken: latestFeedback.status === 'broken' ? 1 : 0 };
    const output = net.run(input);

    res.json({ prediction: output.broken > 0.5 ? 'Broken' : 'Working' });
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).send({ message: 'Error making prediction', error: error.message });
  }
};

export default predictStatus;
