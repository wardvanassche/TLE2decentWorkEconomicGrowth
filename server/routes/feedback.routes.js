import express from 'express';
import { submitFeedback, trainModels, predictStatus } from '../controllers/index.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/feedback', submitFeedback);
feedbackRouter.post('/train', trainModels);
feedbackRouter.post('/predict', predictStatus); 

export default feedbackRouter;
