import express from 'express';
import {trainModel, predictStatus } from '../controllers/index.js';

const modeltrainingRouter = express.Router();

modeltrainingRouter.post('/train', trainModel);
modeltrainingRouter.post('/predict', predictStatus); 

export default modeltrainingRouter;
