// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import BettingControls from './Components/BettingControls';
import GameDisplay from './Components/GameDisplay';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

function App() {
  // Initialize balance from localStorage or default to 1000
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem('playerBalance');
    return stored ? parseFloat(stored) : 1000;
  });

  // Store the bet amount as a string so that the input can be edited freely
  const [betAmount, setBetAmount] = useState("10");
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // For a dummy app, we use a fixed dummy wallet address.
  const [walletAddress] = useState('0x1234567890abcdef1234567890abcdef12345678');

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerBalance', balance.toString());
  }, [balance]);

  const handleBetChange = (e) => {
    setBetAmount(e.target.value);
  };

  const handleQuickBet = (multiplier) => {
    const currentBet = parseFloat(betAmount) || 0;
    const newBet = Math.max(1, Math.floor(currentBet * multiplier));
    setBetAmount(newBet.toString());
  };

  const rollDice = async () => {
    const numericBet = parseFloat(betAmount) || 0;

    if (numericBet < 1) {
      alert("Please enter a valid bet amount (minimum 1).");
      return;
    }
    if (numericBet > balance) {
      alert("Insufficient balance");
      return;
    }

    setIsRolling(true);

    try {
      const response = await axios.post("https://dicegame-upis.onrender.com/roll-dice", {
      // const response = await axios.post("http://localhost:3000/roll-dice", {

        betAmount: numericBet,
        walletAddress,
      });

      const data = response.data;

      const { roll, result, winnings, playerBalance } = data;
      setDiceValue(roll);
      setBalance(playerBalance);
      const isWin = result === 'Win';
      setGameHistory(prev => [
        { roll, win: isWin, amount: isWin ? winnings : -numericBet },
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      console.error('Error rolling dice:', error);
      alert(error.response?.data?.error || "An error occurred while rolling the dice.");
    } finally {
      setIsRolling(false);
    }
  };

  const resetGame = async () => {
    await axios.post("https://dicegame-upis.onrender.com/reset-balance")
    // await axios.post("http://localhost:3000/reset-balance")

      .then(response => {
        const data = response.data;
        setBalance(data.playerBalance);
        setDiceValue(null);
        setGameHistory([]);
      })
      .catch(error => {
        console.error('Error resetting game:', error);
        alert(error.response?.data?.error || "An error occurred while resetting the game.");
      });
  };
  const getDiceIcon = (value) => {
    if (value === null) return null;
    const diceIcons = [
      <Dice1 key="dice1" size={48} className="transition-transform duration-300 animate-dice-roll" />,
      <Dice2 key="dice2" size={48} className="transition-transform duration-300 animate-dice-roll" />,
      <Dice3 key="dice3" size={48} className="transition-transform duration-300 animate-dice-roll" />,
      <Dice4 key="dice4" size={48} className="transition-transform duration-300 animate-dice-roll" />,
      <Dice5 key="dice5" size={48} className="transition-transform duration-300 animate-dice-roll" />,
      <Dice6 key="dice6" size={48} className="transition-transform duration-300 animate-dice-roll" />
    ];
    return diceIcons[value - 1];
  };



  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header walletAddress={walletAddress} balance={balance} />
      <div className="flex flex-col lg:flex-row flex-1">
        <BettingControls
          betAmount={betAmount}
          handleBetChange={handleBetChange}
          handleQuickBet={handleQuickBet}
          isRolling={isRolling}
          rollDice={rollDice}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          resetGame={resetGame}
          gameHistory={gameHistory}
        />
        <GameDisplay diceValue={diceValue} getDiceIcon={getDiceIcon} />
      </div>
    </div>
  );
}

export default App;
