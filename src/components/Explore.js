import React, { useState, useRef } from 'react';
import TicTacToeBoard from './TicTacToeBoard';
import TreeViewer from './TreeViewer';
import ControlsPanel from './ControlsPanel';
import MoveConfidenceChart from './MoveConfidenceChart';
import MoveHeatmap from './MoveHeatmap'
import TreeDepthChart from './TreeDepthChart';

const ExploreWhilePlaying = () => {
  const [nIterations, setNIterations] = useState(1000);
  const [cValue, setCValue] = useState(1.4);
  const [rolloutPolicy, setRolloutPolicy] = useState('random');
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const boardRef = useRef();

  const handleResetGame = () => {
    if (boardRef.current) {
      boardRef.current.handleReset();
    }
  };

  const handleNewTree = (tree, bestMoveId) => {
    setTreeData(tree);
    setSelectedNodeId(bestMoveId);
  };

  const handleUpdateParameters = (newN, newC, newRolloutPolicy) => {
    setNIterations(newN);
    setCValue(newC);
    setRolloutPolicy(newRolloutPolicy);
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
  };

  return (
    <div>
      <h2>Explore While Playing</h2>

      <p>
        Below is a game of tic tac toe! Here, you can play against a bot that is using MCTS to make decisions. 
        Use the control panel to update the parameters used in MCTS.
        Remember to click update parameters after changing the values.
      </p>

      <p>
        For each move the bot makes, you will be able to see the resulting MCTS tree. 
        Remember, the root is the current board state. Blue nodes represent your moves, and red moves represent the bot's moves. 
        The green node is the move the bot chose to play! 
        The numbers inside eaach node represent the # wins / # of visits at that node.
      </p>

      <p>
        You can click on nodes to preview what state that node explored. When you are done previewing states, click return to live game 
        to resume the game. You can also zoom and pan on the tree. 
      </p>

      <p>
        Below, scroll down to find statistics for each tree generated.
      </p>

      <div>
        <ControlsPanel
          nIterations={nIterations}
          cValue={cValue}
          onUpdateParameters={handleUpdateParameters}
          onResetGame={handleResetGame}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '32px',
          width: '100%',
          paddingTop: '15px'
        }}
      >
        <TicTacToeBoard
          style={{ flex: 5, minWidth: 0 }}
          ref={boardRef}
          onBotMoveDone={handleNewTree}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          nIterations={nIterations}
          cValue={cValue}
          rolloutPolicy={rolloutPolicy}
          setTreeData={setTreeData}
        />

        <TreeViewer
          style={{ flexShrink: 0, width: "700px" }}
          treeData={treeData}
          selectedNode={selectedNode}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '32px',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '180px' }}>
            <h3>Move Confidence</h3>
            <p>
              This chart shows possible moves along the x-axis and the number of visits (also representing simulations)
              from that move on the y-axis. The color of the bar represents the expected win rate from that node.
              Notice how changed the exploration term effects how often the move with the highest win rate is visited
              as well as the distribution of visiting moves.
            </p>
          </div>
          <div style={{ flexGrow: 1 }}>
            <MoveConfidenceChart treeData={treeData} />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '210px' }}>
            <h3>Move Frequency Heatmap</h3>
            <p>
              This chart shows how often the bot considered playing in each square during MCTS simulations.
              Darker squares were visited more frequently. Try comparing the output when c = [0.1, 10] to see
              how the exploration term affects the distribution of moves explored.
            </p>
          </div>
          <div style={{ flexGrow: 1 }}>
            <MoveHeatmap treeData={treeData} />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '250px' }}>
            <h3>Tree Depth Chart</h3>
            <p>
              This chart shows how many nodes exist at each level of the tree. Notice how the depth increases as the number
              of iterations increases and how the distribution of nodes at each depth changes when both the exploration term
              and rollout policy are changed. For example, compare N=[100, 1,000, 10,000], c = [0.1, 10], and both rollout policies
              when your first move is the middle square!
            </p>
          </div>
          <div style={{ flexGrow: 1 }}>
            <TreeDepthChart treeData={treeData} />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ExploreWhilePlaying;
