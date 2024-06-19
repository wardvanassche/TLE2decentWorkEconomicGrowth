import Feedback from '../models/feedback.js';

const fetchFeedbackData = async () => {
  try {
    const feedbackData = await Feedback.find({});
    return feedbackData;
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    throw new Error('Database fetch error');
  }
};

export default fetchFeedbackData;
