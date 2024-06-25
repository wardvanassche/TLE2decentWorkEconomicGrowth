import express from 'express';
import stationController from '../controllers/stationController.js';


const stationRouter = express.Router();

stationRouter.post('/station', stationController)

export default stationRouter;