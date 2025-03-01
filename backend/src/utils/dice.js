import crypto from 'crypto';
import web3 from '../config/web3.js';

/**
 * Generates a provably fair dice roll using a seed.
 * @param {string} seed - A unique seed string.
 * @returns {number} - A dice roll number between 1 and 6.
 */
export function generateFairRoll(seed) {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  const roll = parseInt(hash.slice(0, 8), 16) % 6 + 1;
  return roll;
}

/**
 * Retrieves the balance of a given Ethereum wallet address.
 * For the dummy wallet address, returns a simulated balance.
 * @param {string} walletAddress - The Ethereum wallet address.
 * @returns {Promise<string>} - The balance in Ether as a string.
 */
export async function getWalletBalance(walletAddress) {
  if (walletAddress === '0x1234567890abcdef1234567890abcdef12345678') {
    return "1000";
  }
  const balanceWei = await web3.eth.getBalance(walletAddress);
  return web3.utils.fromWei(balanceWei, 'ether');
}
