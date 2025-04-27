import React, { useState, useEffect } from 'react';
import { runMCTS } from './runMCTS';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const TicTacToeBoard = ({ onBotMoveDone, selectedNode }) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares) || !xIsNext) return; // Only allow if it's human's turn
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
    setXIsNext(false);
  }

  useEffect(() => {
    if (!xIsNext && !calculateWinner(squares)) {
      const botMoveTimeout = setTimeout(() => {
        makeBotMove();
      }, 500);

      return () => clearTimeout(botMoveTimeout);
    }
  }, [xIsNext, squares]);

  function makeBotMove() {
    const tree = runMCTS(squares, 100, 1.4, 'O');

    const bestChild = tree.children.reduce((best, child) => 
      child.visits > best.visits ? child : best
    , tree.children[0]);
  
    if (bestChild) {
      const newBoard = bestChild.board.slice();
      setSquares(newBoard);
      setXIsNext(true);
  
      if (onBotMoveDone) {
        onBotMoveDone(tree, bestChild.id);
      }
    }
  }
   
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
};

export default TicTacToeBoard;
