import express from 'express';
import { submitFeedback, trainModels } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/feedback', submitFeedback);
feedbackRouter.post('/train', trainModels);

export default feedbackRouter;
