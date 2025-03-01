import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import Web3 from 'web3';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS so that your frontend (running on another port) can access the backend
app.use(cors());

// Set up a Web3 provider. Here we use Infura to connect to the Ethereum network.
// Replace the providerURL with your Infura Project ID if needed.
const providerURL = 'https://mainnet.infura.io/v3/133afd42958d4debab4d9a8d45086163';
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));

// A dummy off-chain player balance for simulation purposes
let playerBalance = 1000;

// Use body-parser middleware to automatically parse JSON bodies from incoming requests
app.use(bodyParser.json());

/**
 * Generates a provably fair dice roll using a seed.
 * The seed is hashed using SHA-256, then a portion of the hash is converted into a number between 1 and 6.
 *
 * @param {string} seed - A unique seed string.
 * @returns {number} - A dice roll number between 1 and 6.
 */
function generateFairRoll(seed) {
  // Create a SHA-256 hash from the seed
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  // Use the first 8 characters of the hash, convert it to an integer,
  // then use modulo arithmetic to map it to a number between 1 and 6
  const roll = parseInt(hash.slice(0, 8), 16) % 6 + 1;
  console.log("roll", roll);
  return roll;
}

/**
 * Retrieves the balance of a given Ethereum wallet address.
 * This function uses Web3.js to query the blockchain.
 *
 * @param {string} walletAddress - The Ethereum wallet address.
 * @returns {Promise<string>} - The balance in Ether as a string.
 */
async function getWalletBalance(walletAddress) {
  // For our dummy wallet address, return a fixed balance (simulate having funds)
  if (walletAddress === '0x1234567890abcdef1234567890abcdef12345678') {
    return "1000";
  }
  // Otherwise, query the blockchain (this may fail for addresses with no funds)
  const balanceWei = await web3.eth.getBalance(walletAddress);
  return web3.utils.fromWei(balanceWei, 'ether');
}

/**
 * POST endpoint to handle dice roll requests.
 * The request must include:
 *   - betAmount: the amount the player is betting (assumed to be in Ether or your chosen unit)
 *   - walletAddress: the player's Ethereum wallet address
 *
 * The endpoint:
 *  - Validates the Ethereum address.
 *  - Fetches the wallet's on-chain balance using Web3.js (or simulates it for dummy wallets).
 *  - Checks if the wallet has sufficient funds for the bet.
 *  - Generates a provably fair dice roll.
 *  - Updates the simulated off-chain player balance.
 *  - Returns the dice roll, result, winnings, and updated balances as JSON.
 */
app.post("/roll-dice", async (req, res) => {
  const { betAmount, walletAddress } = req.body;

  // Validate that the provided wallet address is a valid Ethereum address
  if (!web3.utils.isAddress(walletAddress)) {
    return res.status(400).send('Invalid Ethereum address');
  }

  // Fetch the player's on-chain wallet balance using Web3.js or simulate it for our dummy wallet
  let walletBalance;
  try {
    if (walletAddress === '0x1234567890abcdef1234567890abcdef12345678') {
      walletBalance = playerBalance.toString();
    } else {


      walletBalance = await getWalletBalance(walletAddress);
    }
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({ error: 'Error fetching wallet balance' });
  }

  // Check if the wallet has sufficient funds for the bet.
  // Here, betAmount is assumed to be in the same unit as the wallet balance (Ether).
  if (parseFloat(walletBalance) < parseFloat(betAmount)) {
    return res.status(400).json({ error: 'Insufficient funds in wallet' });
  }

  // Generate a unique seed by combining the current timestamp and a random number.
  const seed = Date.now().toString() + Math.random().toString();
  // Generate a fair dice roll using the seed
  const roll = generateFairRoll(seed);

  let result = 'Lose';
  let winnings = 0;
  // If the roll is 4, 5, or 6, the player wins (receives 2x the bet amount)
  if (roll >= 4) {
    result = 'Win';
    winnings = betAmount * 2;
  }

  // Update the off-chain simulated balance.
  // In a real application, this might interact with a smart contract for on-chain updates.
  if (result === 'Win') {
    playerBalance += winnings;
  } else {
    playerBalance -= betAmount;
  }

  // Respond with a JSON object containing the dice roll, result, winnings, and updated balances.
  res.json({
    roll,           // The dice roll result (a number between 1 and 6)
    result,         // Outcome: 'Win' or 'Lose'
    winnings,       // Amount won (if any)
    playerBalance,  // Updated simulated off-chain balance
    walletBalance,  // The player's on-chain wallet balance (pre-bet)
    betAmount,      // The bet amount provided by the player
  });
});

// Start the Express server on the specified port.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
