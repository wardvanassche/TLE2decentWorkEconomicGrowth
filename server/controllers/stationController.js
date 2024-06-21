import { Melding } from '../models/meldingen.js';

const stationController = async () => {
  try {
    // Fetch the last 5 feedback entries sorted by createdAt in descending order
    const feedbackData = await Melding.find({}).sort({ createdAt: -1 }).limit(5);

    if (feedbackData.length === 0) {
      console.log('No feedback data found');
      return 'No feedback data';
    }

    // Calculate the average status
    const averageStatus = feedbackData.reduce((sum, record) => sum + (record.status ? 1 : 0), 0) / feedbackData.length;

    // Check if the average status is greater than 0.5
    if (averageStatus > 0.5) {
      console.log('kapot');
      return 'kapot';
    } else {
      console.log('functioning');
      return 'functioning';
    }
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    throw new Error('Database fetch error');
  }
};

export default stationController;
