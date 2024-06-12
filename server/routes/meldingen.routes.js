import express from 'express';
import { Melding } from '../models/meldingen.js';

const meldingRouter = express.Router();

// Middleware for CORS
meldingRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Middleware for JSON header validation
const validateJSONHeader = (req, res, next) => {
  if (req.headers['accept'] !== 'application/json' || req.headers['content-type'] !== 'application/json') {
    console.log(req.headers);
    return res.status(400).json({ ERROR: 'Incorrect header, please send application/json' });
  }
  next();
};

// Apply JSON header validation to all routes
meldingRouter.use(validateJSONHeader);

// Read function - Retrieve all articles
meldingRouter.get('/meldingen', async (req, res) => {
  try {
    const meldingen = await Melding.find({});
    console.log("GET meldingen");
    return res.status(200).json({ count: meldingen.length, data: meldingen });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Detail function - Retrieve a specific article by ID
meldingRouter.get('/meldingen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const melding = await Melding.findById(id);
    if (!melding) {
      return res.status(404).json({ message: 'Artikel niet gevonden' });
    }
    return res.status(200).json(melding);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Create function - Add a new article
meldingRouter.post('/meldingen', async (req, res) => {
  try {
    const { liftID, escelatorID, defect } = req.body;
    if (!liftID && !escelatorID) {
      return res.status(400).json({ message: 'Vul alle verplichte velden in' });
    }
    const newMelding = new Melding({ liftID, escelatorID, defect });
    await newMelding.save();
    return res.status(201).json(newMelding);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Update function - Modify an existing article
meldingRouter.put('/meldingen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { liftID, escelatorID, defect } = req.body;
    if (!liftID && !escelatorID) {
      return res.status(400).json({ message: 'Vul alle verplichte velden in' });
    }
    const updatedMelding = await Melding.findByIdAndUpdate(id, { liftID, escelatorID, defect }, { new: true });
    if (!updatedMelding) {
      return res.status(404).json({ message: 'Artikel niet gevonden' });
    }
    return res.status(200).json({ message: 'Artikel aangepast', updatedMelding });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Delete function - Remove an article
meldingRouter.delete('/meldingen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMelding = await Melding.findByIdAndDelete(id);
    if (!deletedMelding) {
      return res.status(404).json({ message: 'Artikel niet gevonden' });
    }
    return res.status(200).json({ message: 'Artikel verwijderd' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default meldingRouter;
