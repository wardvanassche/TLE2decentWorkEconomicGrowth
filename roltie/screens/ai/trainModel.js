import brain from "brain.js";
import connectDB from "../../utils/fetchMeldingen.js";

async function trainModel() {

  const feedbacks = await fetchFeedbackData();

  // Group feedback by escalator ID
  const feedbacksByEscalator = feedbacks.reduce((acc, feedback) => {
    if (!acc[Roltrappen.escalator_id]) {
      acc[Roltrappen.escalator_id] = [];
    }
    acc[Roltrappen.escalator_id].push({
      input: { broken: Roltrappen.status === "broken" ? 1 : 0 },
      output: { broken: Roltrappen.status === "broken" ? 1 : 0 },
    });
    return acc;
  }, {});

  // Train a model for each escalator
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

  console.log("Models trained and saved.");
  db.close();
}

trainModel();
