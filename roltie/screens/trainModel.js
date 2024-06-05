const brain = require('brain.js');
const SQLite = require('sqlite3').verbose();
const fs = require('fs');

const db = new SQLite.Database('./feedback.db');

function fetchFeedbackData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM feedback', [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

async function trainModel() {
    const feedbacks = await fetchFeedbackData();

    const trainingData = feedbacks.map(feedback => ({
        input: { broken: feedback.status === 'broken' ? 1 : 0 },
        output: { broken: feedback.status === 'broken' ? 1 : 0 }
    }));

    const net = new brain.NeuralNetwork();
    net.train(trainingData, {
        iterations: 20000,
        errorThresh: 0.005,
        log: true,
        logPeriod: 100
    });

    const model = net.toJSON();
    fs.writeFileSync('model.json', JSON.stringify(model));

    console.log('Model trained and saved as model.json');
}

trainModel().then(() => db.close());