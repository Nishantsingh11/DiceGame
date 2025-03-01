import Web3 from 'web3';
import dotenv from 'dotenv';

dotenv.config();

const INFURA_URL = process.env.INFURA_URL || 'https://mainnet.infura.io/v3/133afd42958d4debab4d9a8d45086163';
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

export default web3;
