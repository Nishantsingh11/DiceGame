// Header.jsx
import React from 'react';

const Header = ({ walletAddress, balance }) => {
  return (
    <header className="p-3 sm:p-4 bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2">
      <h1 className="text-xl sm:text-2xl font-bold">Dice Game</h1>
      <p className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">
        Your Wallet: {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
      </p>
      <div className="text-lg sm:text-xl font-semibold">
        Balance: ${balance.toFixed(2)}
      </div>
    </header>
  );
};

export default Header;
