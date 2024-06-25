import {Melding} from '../models/meldingen.js';

const fetchMeldingData = async () => {
  try {
    const feedbackData = await Melding.find({});
    return feedbackData;
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    throw new Error('Database fetch error');
  }
};

export default fetchMeldingData;
