import brain from 'brain.js'; // Import the brain.js library for neural network operations
import { Melding } from '../models/meldingen.js'; // Import the Melding model from the specified path
import TrainedModel from '../models/modelTraining.js'; // Import the TrainedModel model

// Define an asynchronous function to predict the status of an escalator
const predictStatus = async (req, res) => {
  // Extract the escalatorId from the request body
  const { escalatorId } = req.body;

  try {
    // Log a message to indicate fetching the trained model from the database
    console.log("Fetching trained model from database...");
    // Fetch the trained model for the given escalatorId from the database
    const modelRecord = await TrainedModel.findOne({ escalatorId });

    // Check if the model is found; if not, respond with a 404 error
    if (!modelRecord) {
      return res.status(404).json({ error: 'Model not found for this escalator' });
    }

    // Create a new neural network and load the model from the database record
    const net = new brain.NeuralNetwork().fromJSON(modelRecord.model);

    // Log a message to indicate fetching the latest feedback
    console.log("Fetching latest feedback...");
    // Fetch the latest feedback for the given escalatorId, sorted by timestamp in descending order
    const latestFeedback = await Melding.findOne({ escalatorId }).sort({ timestamp: -1 });

    // Check if feedback data is found; if not, respond with a 404 error
    if (!latestFeedback) {
      return res.status(404).json({ error: 'No feedback data found for this escalator' });
    }

    // Prepare the input for the neural network based on the latest feedback status and timestamp
    const input = {
      broken: latestFeedback.status ? 1 : 0, // Assuming status is a boolean
      timestamp: new Date(latestFeedback.timestamp).getTime() / 1000 // Convert timestamp to seconds
    };
    // Run the neural network to get the output prediction
    const output = net.run(input);

    // Convert the output to a percentage
    const brokenPercentage = output.broken * 100;

    // Respond with the prediction as a percentage
    res.json({ prediction: `${brokenPercentage.toFixed(2)}% chance that the escalator is going to break in the near future` });
  } catch (error) {
    // Log any errors that occur during the prediction process
    console.error('Error making prediction:', error);
    // Respond with a 500 error and the error message
    res.status(500).send({ message: 'Error making prediction', error: error.message });
  }
};

// Export the predictStatus function as the default export
export default predictStatus;
