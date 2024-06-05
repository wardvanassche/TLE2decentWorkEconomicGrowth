const brain = require('brain.js');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const model = JSON.parse(fs.readFileSync('model.json', 'utf8'));
const net = new brain.NeuralNetwork().fromJSON(model);

app.post('/predict', (req, res) => {
    const input = req.body; // { broken: 0 or 1 }
    const output = net.run(input);
    res.json({ prediction: output.broken > 0.5 ? 'Broken' : 'Working' });
});

app.listen(port, () => {
    console.log(`Prediction server running at http://localhost:${port}`);
});