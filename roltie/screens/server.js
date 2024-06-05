const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/escalator_feedback', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const feedbackSchema = new mongoose.Schema({
    status: String,
    timestamp: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/submit', async (req, res) => {
    const { status, timestamp } = req.body;
    const feedback = new Feedback({ status, timestamp });
    try {
        await feedback.save();
        res.status(200).send('Feedback saved successfully');
    } catch (error) {
        res.status(500).send('Error saving feedback');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});