import express from "express";
import connectDB from "./utils/DatabaseConnection.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

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
