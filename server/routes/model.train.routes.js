import express from 'express';
import {trainModels, predictStatus } from '../controllers/index.js';

const modeltrainingRouter = express.Router();

modeltrainingRouter.post('/train', trainModels);
modeltrainingRouter.post('/predict', predictStatus); 

export default modeltrainingRouter;
