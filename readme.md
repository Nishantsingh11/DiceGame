# 🎲 Dice Game - Provably Fair

## Overview

**Dice Game** is a simple betting game where players place a bet and roll a six-sided die. The game uses a **provably fair algorithm** (based on SHA-256 hashing) to ensure fair results.

- **Win Condition:** If the roll is 4, 5, or 6, the player wins and receives 2× the bet amount.
- **Lose Condition:** If the roll is 1, 2, or 3, the player loses the bet amount.

This project simulates a crypto wallet using a fixed dummy wallet address and stores the player's balance locally. **No real blockchain transactions occur**, so no fees are incurred.

---

## Live Demo

- **Frontend:** [Dicegamewithweb3](https://dicegamewithweb3.netlify.app/)
- **Backend:** [Dicegame-upis](https://dicegame-upis.onrender.com)

---

## Features

### Frontend (React)
- **Dark-themed UI** using Tailwind CSS.
- **Dice display** with icons (using lucide-react).
- **Input field** for bet amount (minimum is 1, any amount allowed).
- **Balance display** (starting at $1000 credits).
- **"Roll Dice" button** that triggers backend logic.
- **Game history** panel showing past results.

### Backend (Node.js/Express)
- **POST `/roll-dice` API Endpoint:**
  - Validates the Ethereum wallet address.
  - Uses **SHA-256 hashing** for a provably fair dice roll.
  - Simulates checking the wallet balance (using a fixed dummy wallet).
  - Updates the simulated off-chain player balance.
  - Returns game results along with fixed game statistics.

### Game Statistics (Hard-Coded)
- **Win Chance:** 50%
- **Roll Over:** 3.50
- **Multiplier:** 2.00

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v12 or higher)
- npm (comes with Node.js)

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Nishantsingh11/DiceGame.git
   cd backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Backend Server:**
   ```bash
   npm start
   ```
   > The backend runs on `http://localhost:3000`.

### Frontend Setup

1. **Navigate to the Frontend Folder** (if separated) or remain in the project root.
2. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the Frontend Development Server:**
   ```bash
   npm start
   ```
   > The frontend will typically run on a different port (e.g., `http://localhost:5173`).

---

## How to Play

1. Open the frontend URL in your browser.
2. The app uses a fixed dummy wallet address:  
   `0x1234567890abcdef1234567890abcdef12345678`
3. Enter any bet amount (minimum: **1**; e.g., `1, 10, 20, 100`).
4. Click **"Roll Dice"** to simulate a dice roll.
5. The game will display the roll result, update your balance, and record the game history.
6. Game statistics are fixed at:  
   - **Win Chance:** 50%
   - **Roll Over:** 3.50
   - **Multiplier:** 2.00

---

## API Documentation

### POST `/roll-dice`

**Description:**  
Simulates a dice roll using a provably fair algorithm.

**Request Body:**
```json
{
  "betAmount": 10,
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response:**
```json
{
  "roll": 5,
  "result": "Win",
  "winnings": 20,
  "playerBalance": 1020,
  "walletBalance": "1000",
  "betAmount": 10,
  "winChance": 50,
  "rollOver": 3.5,
  "multiplier": 2
}
```

| Field           | Description                                          |
| --------------- | ---------------------------------------------------- |
| **roll**        | Dice roll result (number between 1 and 6)            |
| **result**      | "Win" or "Lose"                                      |
| **winnings**    | Payout (if win); 0 if loss                           |
| **playerBalance** | Updated simulated off-chain balance               |
| **walletBalance** | Dummy on-chain wallet balance (pre-bet)           |
| **betAmount**   | Bet amount provided by the player                    |
| **winChance**   | Hard-coded win chance (50%)                          |
| **rollOver**    | Hard-coded roll over value (3.50)                    |
| **multiplier**  | Hard-coded multiplier (2)                            |

---

## Technologies Used

### Frontend:
- **React**
- **axios**
- **Tailwind CSS** (for styling)
- **lucide-react** (for icons)

### Backend:
- **Node.js**
- **Express**
- **Web3.js** (for dummy wallet simulation)
- **crypto** (for SHA-256 hashing)
- **body-parser**
- **cors**

---

## License

This project is provided for educational and demonstration purposes. Modify and use it as needed.

---

## Contact

For questions or feedback, please contact:  
**Your Name** – [ns114046@gmail.com]