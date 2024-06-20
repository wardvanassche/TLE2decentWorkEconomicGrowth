import {Melding} from '../models/meldingen.js';

const submitMelding = async (req, res) => {
  const { escalatorId, status } = req.body;
  const timestamp = new Date();

  const melding = new Melding({ escalatorId, status, timestamp });
  console.log(melding);
  try {
    await melding.save();
    res.status(201).send({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting melding:', error);
    res.status(500).send({ message: 'Error submitting melding', error: error.message });
  }
};

export default submitMelding;
