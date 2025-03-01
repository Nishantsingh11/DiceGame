// BettingControls.jsx
import React from 'react';
import { RotateCw } from 'lucide-react';
import GameHistory from './GameHistory';

const BettingControls = ({
    betAmount,
    handleBetChange,
    handleQuickBet,
    isRolling,
    rollDice,
    showHistory,
    setShowHistory,
    resetGame,
    gameHistory,
}) => {
    return (
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
                <GameHistory gameHistory={gameHistory} />
            )}
        </div>
    );
};

export default BettingControls;
