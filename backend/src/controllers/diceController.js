import { generateFairRoll, getWalletBalance } from '../utils/dice.js';

/**
 * Controller for the dice roll endpoint.
 */
export async function rollDiceController(req, res, next) {
  try {
    const { betAmount, walletAddress } = req.body;
    
    // Fetch or simulate the wallet balance
    let walletBalance;
    if (walletAddress === '0x1234567890abcdef1234567890abcdef12345678') {
      walletBalance = req.app.locals.playerBalance.toString();
    } else {
      walletBalance = await getWalletBalance(walletAddress);
    }
    
    if (parseFloat(walletBalance) < parseFloat(betAmount)) {
      return res.status(400).json({ error: 'Insufficient funds in wallet' });
    }
    
    // Generate a unique seed and dice roll
    const seed = Date.now().toString() + Math.random().toString();
    const roll = generateFairRoll(seed);
    
    let result = 'Lose';
    let winnings = 0;
    if (roll >= 4) {
      result = 'Win';
      winnings = betAmount * 2;
    }
    
    // Update simulated off-chain balance (stored in app.locals)
    if (result === 'Win') {
      req.app.locals.playerBalance += winnings;
    } else {
      req.app.locals.playerBalance -= betAmount;
    }
    
    res.json({
      roll,
      result,
      winnings,
      playerBalance: req.app.locals.playerBalance,
      walletBalance,
      betAmount
    });
  } catch (error) {
    console.error('Error in rollDiceController:', error);
    next(error);
  }
}

/**
 * Controller for the reset balance endpoint.
 */
export function resetBalanceController(req, res, next) {
  try {
    req.app.locals.playerBalance = 1000;
    res.json({
      playerBalance: req.app.locals.playerBalance,
      message: "Player balance has been reset to 1000."
    });
  } catch (error) {
    console.error('Error in resetBalanceController:', error);
    next(error);
  }
}
