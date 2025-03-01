import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import diceRoutes from './routes/diceRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Global middleware
app.use(cors());
app.use(bodyParser.json());

// Use the dice routes
app.use('/', diceRoutes);

// Centralized error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
