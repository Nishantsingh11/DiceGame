import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RefreshCw, RotateCw } from 'lucide-react';

function App() {
  // Initialize balance from localStorage or default to 1000
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem('playerBalance');
    return stored ? parseFloat(stored) : 1000;
  });

  const [betAmount, setBetAmount] = useState(10);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // For a dummy app, we can use a fixed dummy wallet address.
  const [walletAddress] = useState('0x1234567890abcdef1234567890abcdef12345678');

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerBalance', balance);
  }, [balance]);
  const handleBetChange = (e) => {
    // Convert the input value to a number.
    const value = parseInt(e.target.value, 10);
    // If the value is invalid or less than 1, default to 1.
    if (isNaN(value) || value < 1) {
      setBetAmount(1);
    } else {
      setBetAmount(value);
    }
  };

  const handleQuickBet = (multiplier) => {
    setBetAmount(prev => Math.max(1, Math.floor(prev * multiplier)));
  };

  // In this dummy version, the backend can ignore real blockchain balance checks
  const rollDice = async () => {
    if (betAmount <= 0) {
      alert("Please enter a valid bet amount");
      return;
    }

    if (betAmount > balance) {
      alert("Insufficient balance");
      return;
    }

    setIsRolling(true);

    try {
      // Call the backend to simulate a dice roll
      const response = await axios.post('https://dicegame-upis.onrender.com/roll-dice', {
        betAmount,
        walletAddress,
      });

      const data = response.data;
      console.log("Server response:", data);

      const { roll, result, winnings, playerBalance } = data;
      setDiceValue(roll);
      setBalance(playerBalance); // update the dummy balance based on the server logic
      const isWin = result === 'Win';
      setGameHistory(prev => [
        { roll, win: isWin, amount: isWin ? winnings : -betAmount },
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      console.error('Error rolling dice:', error);
      alert(error.response?.data?.error || "An error occurred while rolling the dice.");
    } finally {
      setIsRolling(false);
    }
  };

  const getDiceIcon = (value) => {
    if (value === null) return null;
    const diceIcons = [
      <Dice1 size={64} />,
      <Dice2 size={64} />,
      <Dice3 size={64} />,
      <Dice4 size={64} />,
      <Dice5 size={64} />,
      <Dice6 size={64} />
    ];
    return diceIcons[value - 1];
  };

  const resetGame = () => {
    setBalance(1000);
    setBetAmount(10);
    setDiceValue(null);
    setGameHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 bg-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dice Game</h1>
        <p>Your Wallet Address: {walletAddress}</p>
        <div className="text-xl font-semibold">
          Balance: ${balance.toFixed(2)}
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Panel - Betting Controls */}
        <div className="w-full md:w-1/3 bg-gray-800 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <button
              className={`px-4 py-2 rounded-full ${!showHistory ? 'bg-green-500' : 'bg-gray-700'}`}
              onClick={() => setShowHistory(false)}
            >
              Manual
            </button>
            <button
              className={`px-4 py-2 rounded-full ${showHistory ? 'bg-green-500' : 'bg-gray-700'}`}
              onClick={() => setShowHistory(true)}
            >
              History
            </button>
            <RotateCw
              className="cursor-pointer text-gray-400 hover:text-white"
              onClick={resetGame}
            />
          </div>

          {!showHistory ? (
            <>
              <div>
                <label className="block text-gray-400 mb-2">Bet Amount</label>
                <div className="flex">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={handleBetChange}
                    min="1" // Ensures the minimum value is 1
                    className="bg-gray-700 text-white p-3 rounded-l-md w-full"
                    disabled={isRolling}
                  />

                  <span className="bg-gray-600 flex items-center justify-center px-3 rounded-r-md">
                    $
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-gray-700 py-2 rounded-md"
                  onClick={() => handleQuickBet(0.5)}
                  disabled={isRolling}
                >
                  ½
                </button>
                <button
                  className="flex-1 bg-gray-700 py-2 rounded-md"
                  onClick={() => handleQuickBet(2)}
                  disabled={isRolling}
                >
                  2×
                </button>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Profit on Win</label>
                <div className="flex">
                  <input
                    type="text"
                    value={betAmount.toFixed(2)}
                    className="bg-gray-700 text-white p-3 rounded-l-md w-full"
                    disabled
                  />
                  <span className="bg-gray-600 flex items-center justify-center px-3 rounded-r-md">
                    $
                  </span>
                </div>
              </div>

              <button
                className="mt-4 bg-green-500 hover:bg-green-600 py-4 rounded-md text-xl font-bold"
                onClick={rollDice}
                disabled={isRolling}
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </button>
            </>
          ) : (
            <div className="flex-1 overflow-auto">
              <h3 className="text-lg font-semibold mb-2">Game History</h3>
              {gameHistory.length === 0 ? (
                <p className="text-gray-400">No games played yet</p>
              ) : (
                <div className="space-y-2">
                  {gameHistory.map((game, index) => (
                    <div key={index} className={`p-2 rounded ${game.win ? 'bg-green-800/30' : 'bg-red-800/30'} flex justify-between`}>
                      <span>Roll: {game.roll}</span>
                      <span className={game.win ? 'text-green-400' : 'text-red-400'}>
                        {game.win ? '+' : ''}{game.amount}$
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Game Display */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="mb-12 h-32 flex items-center justify-center">
            {diceValue === null ? (
              <div className="text-2xl text-gray-400">Roll the dice to play!</div>
            ) : (
              <div className={`text-6xl ${diceValue >= 4 ? 'text-green-500' : 'text-red-500'}`}>
                {getDiceIcon(diceValue)}
              </div>
            )}
          </div>

          <div className="w-full max-w-3xl">
            <div className="flex justify-between mb-2">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>

            <div className="relative h-12 bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1/2 bg-red-500"></div>
              <div className="absolute right-0 top-0 h-full w-1/2 bg-green-500"></div>
              {diceValue && (
                <div
                  className="absolute top-0 h-full w-12 bg-blue-500 transform -translate-x-1/2 flex items-center justify-center"
                  style={{
                    left: `${((diceValue - 1) / 5) * 100}%`,
                    transition: 'left 0.3s ease-out'
                  }}
                >
                  <span className="text-white font-bold">|||</span>
                </div>
              )}
              {diceValue && (
                <div
                  className="absolute top-0 transform -translate-x-1/2 -translate-y-full mt-[-20px]"
                  style={{
                    left: `${((diceValue - 1) / 5) * 100}%`,
                    transition: 'left 0.3s ease-out'
                  }}
                >
                  <div className="bg-white text-gray-900 font-bold p-4 rounded-md">
                    {diceValue}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-3xl mt-12 grid grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-gray-400 mb-2">Multiplier</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">2.0000</span>
                <span className="text-gray-400">×</span>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-gray-400 mb-2">Roll Over</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">3.50</span>
                <RefreshCw className="text-gray-400" size={20} />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-gray-400 mb-2">Win Chance</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">50.0000</span>
                <span className="text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDiceIcon(value) {
  if (value === null) return null;
  const diceIcons = [
    <Dice1 size={64} />,
    <Dice2 size={64} />,
    <Dice3 size={64} />,
    <Dice4 size={64} />,
    <Dice5 size={64} />,
    <Dice6 size={64} />
  ];
  return diceIcons[value - 1];
}

export default App;
