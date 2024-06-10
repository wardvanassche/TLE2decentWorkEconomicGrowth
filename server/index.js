import express from "express";
import connectDB from "./utils/DatabaseConnection.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import routes from './routes/routes.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/roltie', routes);

const startServer = async () => {
  await connectDB();

  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on Port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();

