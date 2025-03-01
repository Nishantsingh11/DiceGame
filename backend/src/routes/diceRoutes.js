import express from 'express';
import { rollDiceController, resetBalanceController } from '../controllers/diceController.js';
import apiLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

// Initialize the simulated player balance in app.locals if not set
router.use((req, res, next) => {
  if (typeof req.app.locals.playerBalance === 'undefined') {
    req.app.locals.playerBalance = 1000;
  }
  next();
});

router.post('/roll-dice', apiLimiter, rollDiceController);
router.post('/reset-balance', apiLimiter, resetBalanceController);

export default router;
