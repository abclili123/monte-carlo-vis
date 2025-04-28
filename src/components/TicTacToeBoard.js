import React, { useState, useEffect } from 'react';
import { runMCTS } from './runMCTS';

function Square({ value, realValue, onSquareClick, isPreview }) {
  const isRealMove = realValue !== null;
  const color = isPreview ? (isRealMove ? 'black' : 'lightgray') : 'black';

  return (
    <button 
      className="square" 
      onClick={onSquareClick}
      style={{ 
        fontSize: '48px',
        width: '100px',
        height: '100px',
        lineHeight: '100px',
        fontWeight: 'bold',
        textAlign: 'center',
        border: '1px solid black',
        backgroundColor: 'white',
        cursor: 'pointer',
      }}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const TicTacToeBoard = ({ onBotMoveDone, selectedNode, setSelectedNode, nIterations, cValue, rolloutPolicy }) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    if (selectedNode) return;
    if (squares[i] || calculateWinner(squares) || !xIsNext) return;

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
    const tree = runMCTS(squares, nIterations, cValue, 'O', rolloutPolicy);
    const bestChild = tree.children.reduce((best, child) =>
      child.visits > best.visits ? child : best,
      tree.children[0]
    );

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
  const isBoardFull = squares.every(square => square !== null);
  const isGameOver = winner || isBoardFull;

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isBoardFull) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    if (setSelectedNode) {
      setSelectedNode(null);
    }
    if (onBotMoveDone) {
      onBotMoveDone(null, null);
    }
  }

  const displaySquares = selectedNode ? selectedNode.board : squares;

  return (
    <div>
      {selectedNode && (
        <button onClick={() => setSelectedNode(null)}>
          Return to Live Game
        </button>
      )}
      {isGameOver && (
        <button onClick={handleReset}>
          Reset Game
        </button>
      )}
      <div className="game">
        <div className="status">{status}</div>
        {[0, 3, 6].map(row => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map(col => (
              <Square
                key={row + col}
                value={displaySquares[row + col]}
                realValue={squares[row + col]}
                onSquareClick={() => handleClick(row + col)}
                isPreview={!!selectedNode}
              />
            ))}
          </div>
        ))}
      </div>
    </ div>
  );
};

export default TicTacToeBoard;
