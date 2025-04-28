import React, { useState } from 'react';
import TicTacToeBoard from './TicTacToeBoard';
import TreeViewer from './TreeViewer';
import ControlsPanel from './ControlsPanel';

const ExploreWhilePlaying = () => {
  const [showTree, setShowTree] = useState(true);
  const [nIterations, setNIterations] = useState(100);
  const [cValue, setCValue] = useState(1.4);
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

  const handleUpdateParameters = (newN, newC) => {
    setNIterations(newN);
    setCValue(newC);
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
  };

  return (
    <div>
      <h2>Explore While Playing</h2>

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
        }}
      >
        <TicTacToeBoard
          style={{ flex: 5, minWidth: 0 }}
          onBotMoveDone={handleNewTree}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          nIterations={nIterations}
          cValue={cValue}
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
    </div>
  );
};

export default ExploreWhilePlaying;
