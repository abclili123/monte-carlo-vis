import React, { useState } from 'react';
import TicTacToeBoard from './TicTacToeBoard';
import TreeViewer from './TreeViewer';
import ControlsPanel from './ControlsPanel';
import MoveConfidenceChart from './MoveConfidenceChart';

const ExploreWhilePlaying = () => {
  const [showTree, setShowTree] = useState(true);
  const [nIterations, setNIterations] = useState(100);
  const [cValue, setCValue] = useState(1.4);
  const [rolloutPolicy, setRolloutPolicy] = useState('random');
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleNewTree = (tree, bestMoveId) => {
    setTreeData(tree);
    setSelectedNodeId(bestMoveId);
  };

  const handleToggleTree = () => {
    setShowTree((prev) => !prev);
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
      </p>

      <p>
        For each move the bot makes, you will be able to see the resulting MCTS tree. 
        Remember, the root is the current board state. Blue nodes represent your moves, and red moves represent the bot's moves. 
        The green node is the move the bot chose to play! 
        You can click on nodes to preview what state that node explored. When you are done previewing states, click return to live game 
        to resume the game. You can also zoom and pan on the tree. 
      </p>

      <p>
        Below, you will find statistics for each tree generated.
      </p>

      <div>
        <ControlsPanel
          nIterations={nIterations}
          cValue={cValue}
          onUpdateParameters={handleUpdateParameters}
          onToggleTree={handleToggleTree}
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
          onBotMoveDone={handleNewTree}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          nIterations={nIterations}
          cValue={cValue}
          rolloutPolicy={rolloutPolicy}
        />

        {showTree && treeData && (
          <TreeViewer
            style={{ flexShrink: 0, width: "700px" }}
            treeData={treeData}
            selectedNode={selectedNode}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
          />
        )}
      </div>

      {treeData && (
        <div style={{ marginTop: '32px' }}>
          <h3>Move Confidence</h3>
          <MoveConfidenceChart treeData={treeData} />
        </div>
      )}
    </div>
  );
};

export default ExploreWhilePlaying;
