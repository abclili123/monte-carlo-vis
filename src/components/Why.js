import React from 'react';

const Why = () => {
  return (
    <div className="max-w-3xl mx-auto text-center p-8">
      <h2 className="text-3xl font-bold mb-4">Why Use Monte Carlo Tree Search?</h2>
      <ul className="text-lg mb-6 list-disc list-inside text-left">
        <li className="mb-2">
          <span className="font-semibold">🧠 Smarter exploration:</span> Balances trying new moves with picking good moves.
        </li>
        <li className="mb-2">
          <span className="font-semibold">🌳 Grows the tree where needed:</span> Focuses on likely good paths, not every possible move.
        </li>
        <li className="mb-2">
          <span className="font-semibold">⚡ Handles big games:</span> Works even when there are too many moves to search exhaustively.
        </li>
      </ul>
    </div>
  );
};

export default Why;
