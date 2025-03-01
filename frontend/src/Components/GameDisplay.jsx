// GameDisplay.jsx
import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RefreshCw } from 'lucide-react';

const GameDisplay = ({ diceValue, getDiceIcon }) => {
  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center">
      <div className="mb-6 sm:mb-12 h-24 sm:h-32 flex items-center justify-center">
        {diceValue === null ? (
          <div className="text-lg sm:text-2xl text-gray-400 text-center px-4">
            Roll the dice to play!
          </div>
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
  );
};

export default GameDisplay;
