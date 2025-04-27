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
    setShowTree(prev => !prev);
  };

  const handleUpdateParameters = (newN, newC) => {
    setNIterations(newN);
    setCValue(newC);
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <h2 className="text-3xl font-bold">Explore While Playing</h2>
      <ControlsPanel 
        nIterations={nIterations}
        cValue={cValue}
        onUpdateParameters={handleUpdateParameters}
        onToggleTree={handleToggleTree}
      />
      <TicTacToeBoard 
        onBotMoveDone={handleNewTree}
        selectedNode={selectedNode}
      />
      {showTree && treeData && (
        <TreeViewer 
          treeData={treeData} 
          selectedNode={selectedNode}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
        />      
      )}
    </div>
  );
};

export default ExploreWhilePlaying;
