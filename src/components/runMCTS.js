let globalNodeId = 0;

export function runMCTS(startBoard, nIterations, cValue, botPlayer = 'O', rolloutPolicy = 'random') {
    const root = createNode(startBoard, null, oppositePlayer(botPlayer));

    for (let i = 0; i < nIterations; i++) {
        const path = select(root, cValue);
        const leaf = path[path.length - 1];
        if (!isTerminal(leaf.board)) {
            expand(leaf);
        }
        const result = simulate(leaf.board, nextPlayer(leaf.player), rolloutPolicy);
        backpropagate(path, result, botPlayer);
    }

    return root;
}

function createNode(board, move, player) {
    return {
    id: globalNodeId++,
    board: board.slice(),
    wins: 0,
    visits: 0,
    player: player,
    move: move,
    children: [],
    };
}

function select(node, c) {
    const path = [];
    while (true) {
      path.push(node);
  
      if (isTerminal(node.board)) {
        return path;
      }
  
      const possibleMoves = getPossibleMoves(node.board);
      const existingMoves = node.children.map(child => child.move);
  
      if (existingMoves.length < possibleMoves.length) {
        return path;  // Node not fully expanded yet
      }
  
      node = bestUCT(node.children, node.visits, c);
    }
  }
  
  
function expand(node) {
    if (isTerminal(node.board)) {
      // Don't expand if node is terminal
      return;
    }
  
    const possibleMoves = getPossibleMoves(node.board);
  
    // Find moves that haven't been expanded yet
    const existingMoves = node.children.map(child => child.move);
    const unexpandedMoves = possibleMoves.filter(move => !existingMoves.includes(move));
  
    if (unexpandedMoves.length > 0) {
      // Pick one random unexpanded move
      const move = unexpandedMoves[Math.floor(Math.random() * unexpandedMoves.length)];
      const newBoard = node.board.slice();
      newBoard[move] = nextPlayer(node.player);  // place the opposite player's move
      const newNode = createNode(newBoard, move, nextPlayer(node.player));
      node.children.push(newNode);
    }
}  

function simulate(board, player, rolloutPolicy = 'random') {
    let simBoard = board.slice();
    let currentPlayer = player;

    while (!isTerminal(simBoard)) {
        const moves = getPossibleMoves(simBoard);

        let move;
        if (rolloutPolicy === 'heuristic') {
            move = heuristicMove(simBoard, moves, currentPlayer);
        } else {
            move = moves[Math.floor(Math.random() * moves.length)];
        }

        simBoard[move] = currentPlayer;
        currentPlayer = nextPlayer(currentPlayer);
    }

    return getUtility(simBoard);
}

function heuristicMove(board, moves, player) {
    // heuristic: center > corners > edges
    const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

    for (const idx of preferredOrder) {
        if (moves.includes(idx)) {
            return idx;
        }
    }

    // fallback random
    return moves[Math.floor(Math.random() * moves.length)];
}

function backpropagate(path, result, botPlayer) {
    for (let node of path) {
        node.visits += 1;
        if (result === 0) {
        node.wins += 0.5;
        } else if ((result === 1 && botPlayer === 'X') || (result === -1 && botPlayer === 'O')) {
        node.wins += 1;
        }
    }
}

function getPossibleMoves(board) {
    return board.map((v, i) => v === null ? i : null).filter(v => v !== null);
}

function nextPlayer(player) {
    return player === 'X' ? 'O' : 'X';
}

function oppositePlayer(player) {
    return player === 'X' ? 'O' : 'X';
}

function isTerminal(board) {
    return getWinner(board) !== null || !board.includes(null);
}

function getUtility(board) {
    const winner = getWinner(board);
    if (winner === 'X') return 1;
    if (winner === 'O') return -1;
    return 0; // Draw
}

function getWinner(board) {
    const lines = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6],
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
        }
    }
    return null;
}

function bestUCT(children, parentVisits, c) {
    return children.reduce((best, child) => {
        const bestScore = uct(best, parentVisits, c);
        const childScore = uct(child, parentVisits, c);
        return childScore > bestScore ? child : best;
    }, children[0]);
}

function uct(node, parentVisits, c) {
    if (node.visits === 0) return Infinity;
    return (node.wins / node.visits) + c * Math.sqrt(Math.log(parentVisits) / node.visits);
}
  