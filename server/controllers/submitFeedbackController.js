import Feedback from '../models/feedback.js';

const submitFeedback = async (req, res) => {
  const { escalatorId, status } = req.body;
  const timestamp = new Date();

  const feedback = new Feedback({ escalatorId, status, timestamp });
  console.log(feedback);
  try {
    await feedback.save();
    res.status(201).send({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).send({ message: 'Error submitting feedback', error: error.message });
  }
};

export default submitFeedback;
