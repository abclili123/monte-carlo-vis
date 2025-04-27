import React, { useState, useEffect } from 'react';
import { runMCTS } from './runMCTS';

function Square({ value, realValue, onSquareClick, isPreview }) {
  const isRealMove = realValue !== null;

  const color = isPreview
    ? (isRealMove ? 'black' : 'lightgray')
    : 'black';

  return (
    <button 
      className="square" 
      onClick={onSquareClick}
      style={{ 
        color: color,
        fontSize: '32px',
        width: '64px',
        height: '64px',
        fontWeight: 'bold',
        lineHeight: '64px',
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

const TicTacToeBoard = ({ onBotMoveDone, selectedNode, setSelectedNode }) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    if (selectedNode) return; // Block clicks if previewing
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

  const displaySquares = selectedNode ? selectedNode.board : squares;
  return (
    <>
    {selectedNode && (
      <button onClick={() => setSelectedNode(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Return to Live Game
      </button>
    )}
    <div className="game">
      <div className="status">{status}</div>
      <div className="board-row">
        <Square 
          value={displaySquares[0]} 
          realValue={squares[0]} 
          onSquareClick={() => handleClick(0)} 
          isPreview={!!selectedNode}
        />
        <Square 
          value={displaySquares[1]} 
          realValue={squares[1]} 
          onSquareClick={() => handleClick(1)} 
          isPreview={!!selectedNode}
        />
        <Square 
          value={displaySquares[2]} 
          realValue={squares[2]} 
          onSquareClick={() => handleClick(2)} 
          isPreview={!!selectedNode}
        />
      </div>
      <div className="board-row">
        <Square 
          value={displaySquares[3]} 
          realValue={squares[3]} 
          onSquareClick={() => handleClick(3)} 
          isPreview={!!selectedNode}
        />
        <Square 
          value={displaySquares[4]} 
          realValue={squares[4]} 
          onSquareClick={() => handleClick(4)} 
          isPreview={!!selectedNode}
        />
        <Square 
          value={displaySquares[5]} 
          realValue={squares[5]} 
          onSquareClick={() => handleClick(5)} 
          isPreview={!!selectedNode}
        />
      </div>
      <div className="board-row">
        <Square 
          value={displaySquares[6]} 
          realValue={squares[6]} 
          onSquareClick={() => handleClick(6)} 
          isPreview={!!selectedNode}
        />
        <Square 
          value={displaySquares[7]} 
          realValue={squares[7]} 
          onSquareClick={() => handleClick(7)} 
          isPreview={!!selectedNode}
        />
        <Square 
          value={displaySquares[8]} 
          realValue={squares[8]} 
          onSquareClick={() => handleClick(8)} 
          isPreview={!!selectedNode}
        />
      </div>
    </div>
    </>
  );
};

export default TicTacToeBoard;
