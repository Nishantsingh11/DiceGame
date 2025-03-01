import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RefreshCw, RotateCw } from 'lucide-react';

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

  // Now, handleBetChange simply updates the string state.
  const handleBetChange = (e) => {
    setBetAmount(e.target.value);
  };

  const handleQuickBet = (multiplier) => {
    // Convert current betAmount to a number, update, and then convert back to string.
    const currentBet = parseFloat(betAmount) || 0;
    const newBet = Math.max(1, Math.floor(currentBet * multiplier));
    setBetAmount(newBet.toString());
  };

  // In rollDice, convert betAmount to a number for validation and calculation.
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
      // Call the backend to simulate a dice roll
      const response = await axios.post("https://dicegame-upis.onrender.com/roll-dice", {
        betAmount: numericBet,
        walletAddress,
      });

      const data = response.data;
      console.log("Server response:", data);

      const { roll, result, winnings, playerBalance } = data;
      setDiceValue(roll);
      setBalance(playerBalance); // update the dummy balance based on the server logic
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

  const getDiceIcon = (value) => {
    if (value === null) return null;
    const diceIcons = [
      <Dice1 key="dice1" size={48} />,
      <Dice2 key="dice2" size={48} />,
      <Dice3 key="dice3" size={48} />,
      <Dice4 key="dice4" size={48} />,
      <Dice5 key="dice5" size={48} />,
      <Dice6 key="dice6" size={48} />
    ];
    return diceIcons[value - 1];
  };

  const resetGame = async () => {
    await axios.post('https://dicegame-upis.onrender.com/reset-game')
      .then(response => {
        const data = response.data;
        console.log("Server response:", data);
        setBalance(data.playerBalance);
        setDiceValue(null);
        setGameHistory([]);
      })
      .catch(error => {
        console.error('Error resetting game:', error);
        alert(error.response?.data?.error || "An error occurred while resetting the game.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Dice Game</h1>
        <p className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">
          Your Wallet: {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
        </p>
        <div className="text-lg sm:text-xl font-semibold">
          Balance: ${balance.toFixed(2)}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Panel - Betting Controls */}
        <div className="w-full lg:w-1/3 bg-gray-800 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
          <div className="flex justify-between items-center">
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full ${!showHistory ? 'bg-green-500' : 'bg-gray-700'}`}
              onClick={() => setShowHistory(false)}
            >
              Manual
            </button>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full ${showHistory ? 'bg-green-500' : 'bg-gray-700'}`}
              onClick={() => setShowHistory(true)}
            >
              History
            </button>
            <RotateCw
              className="cursor-pointer text-gray-400 hover:text-white"
              size={20}
              onClick={resetGame}
            />
          </div>

          {!showHistory ? (
            <>
              <div>
                <label className="block text-gray-400 mb-1 sm:mb-2 text-sm sm:text-base">Bet Amount</label>
                <div className="flex">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={handleBetChange}
                    min="1"
                    className="bg-gray-700 text-white p-2 sm:p-3 rounded-l-md w-full text-sm sm:text-base"
                    disabled={isRolling}
                  />
                  <span className="bg-gray-600 flex items-center justify-center px-2 sm:px-3 rounded-r-md">
                    $
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-gray-700 py-1 sm:py-2 rounded-md text-sm sm:text-base"
                  onClick={() => handleQuickBet(0.5)}
                  disabled={isRolling}
                >
                  ½
                </button>
                <button
                  className="flex-1 bg-gray-700 py-1 sm:py-2 rounded-md text-sm sm:text-base"
                  onClick={() => handleQuickBet(2)}
                  disabled={isRolling}
                >
                  2×
                </button>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 sm:mb-2 text-sm sm:text-base">Profit on Win</label>
                <div className="flex">
                  <input
                    type="text"
                    value={parseFloat(betAmount).toFixed(2)}
                    className="bg-gray-700 text-white p-2 sm:p-3 rounded-l-md w-full text-sm sm:text-base"
                    disabled
                  />
                  <span className="bg-gray-600 flex items-center justify-center px-2 sm:px-3 rounded-r-md">
                    $
                  </span>
                </div>
              </div>

              <button
                className="mt-2 sm:mt-4 bg-green-500 hover:bg-green-600 py-3 sm:py-4 rounded-md text-lg sm:text-xl font-bold"
                onClick={rollDice}
                disabled={isRolling}
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </button>
            </>
          ) : (
            <div className="flex-1 overflow-auto">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Game History</h3>
              {gameHistory.length === 0 ? (
                <p className="text-gray-400 text-sm sm:text-base">No games played yet</p>
              ) : (
                <div className="space-y-2">
                  {gameHistory.map((game, index) => (
                    <div key={index} className={`p-2 rounded ${game.win ? 'bg-green-800/30' : 'bg-red-800/30'} flex justify-between text-sm sm:text-base`}>
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
        <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="mb-6 sm:mb-12 h-24 sm:h-32 flex items-center justify-center">
            {diceValue === null ? (
              <div className="text-lg sm:text-2xl text-gray-400 text-center px-4">Roll the dice to play!</div>
            ) : (
              <div className={`text-4xl sm:text-6xl ${diceValue >= 4 ? 'text-green-500' : 'text-red-500'}`}>
                {getDiceIcon(diceValue)}
              </div>
            )}
          </div>

          <div className="w-full max-w-3xl px-2 sm:px-0">
            <div className="flex justify-between mb-2 text-xs sm:text-sm">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>

            <div className="relative h-8 sm:h-12 bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1/2 bg-red-500"></div>
              <div className="absolute right-0 top-0 h-full w-1/2 bg-green-500"></div>
              {diceValue && (
                <div
                  className="absolute top-0 h-full w-8 sm:w-12 bg-blue-500 transform -translate-x-1/2 flex items-center justify-center"
                  style={{
                    left: `${((diceValue - 1) / 5) * 100}%`,
                    transition: 'left 0.3s ease-out'
                  }}
                >
                  <span className="text-white font-bold text-xs sm:text-base">|||</span>
                </div>
              )}
              {diceValue && (
                <div
                  className="absolute top-0 transform -translate-x-1/2 -translate-y-full mt-[-16px] sm:mt-[-20px]"
                  style={{
                    left: `${((diceValue - 1) / 5) * 100}%`,
                    transition: 'left 0.3s ease-out'
                  }}
                >
                  <div className="bg-white text-gray-900 font-bold p-2 sm:p-4 rounded-md text-sm sm:text-base">
                    {diceValue}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-3xl mt-6 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
            <div className="bg-gray-800 p-3 sm:p-4 rounded-md">
              <h3 className="text-gray-400 mb-1 sm:mb-2 text-xs sm:text-sm">Multiplier</h3>
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-xl font-bold">2.0000</span>
                <span className="text-gray-400">×</span>
              </div>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-md">
              <h3 className="text-gray-400 mb-1 sm:mb-2 text-xs sm:text-sm">Roll Over</h3>
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-xl font-bold">3.50</span>
                <RefreshCw className="text-gray-400" size={16} />
              </div>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-md">
              <h3 className="text-gray-400 mb-1 sm:mb-2 text-xs sm:text-sm">Win Chance</h3>
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-xl font-bold">50.0000</span>
                <span className="text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
