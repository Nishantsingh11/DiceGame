// GameHistory.jsx
import React from 'react';

const GameHistory = ({ gameHistory }) => {
  return (
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
  );
};

export default GameHistory;
