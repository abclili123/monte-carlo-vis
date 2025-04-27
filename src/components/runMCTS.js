let globalNodeId = 0;

export function runMCTS(startBoard, nIterations, cValue, botPlayer = 'O') {
    const root = createNode(startBoard, null, oppositePlayer(botPlayer));

    for (let i = 0; i < nIterations; i++) {
    const path = select(root, cValue);
    const leaf = path[path.length - 1];
    if (!isTerminal(leaf.board)) {
        expand(leaf);
    }
    const result = simulate(leaf.board, nextPlayer(leaf.player));
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
        if (node.children.length === 0) {
        return path;
        }
        if (node.children.some(child => child.visits === 0)) {
        const unexplored = node.children.filter(child => child.visits === 0);
        const randomUnexplored = unexplored[Math.floor(Math.random() * unexplored.length)];
        path.push(randomUnexplored);
        return path;
        }
        node = bestUCT(node.children, node.visits, c);
    }
}
  
function expand(node) {
    if (isTerminal(node.board)) return;
    
    const possibleMoves = getPossibleMoves(node.board);
    
    for (let move of possibleMoves) {
      const newBoard = node.board.slice();
      newBoard[move] = nextPlayer(node.player);
      const newNode = createNode(newBoard, move, nextPlayer(node.player));
      node.children.push(newNode);
    }
}  

function simulate(board, player) {
    let simBoard = board.slice();
    let currentPlayer = player;

    while (!isTerminal(simBoard)) {
        const moves = getPossibleMoves(simBoard);
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        simBoard[randomMove] = currentPlayer;
        currentPlayer = nextPlayer(currentPlayer);
    }

    return getUtility(simBoard);
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
  