import React, { useState } from 'react';
import * as d3 from 'd3';

const Walkthrough = () => {
  const [treeData, setTreeData] = useState({
    id: 1,
    wins: 37,
    visits: 100,
    maxChildren: 3,
    children: [
      { id: 2, wins: 60, visits: 79, maxChildren: 2, children: [
        { id: 5, wins: 3, visits: 26, maxChildren: 0, children: [] },
        { id: 6, wins: 16, visits: 53, maxChildren: 2, children: [
          { id: 10, wins: 27, visits: 35, maxChildren: 0, children: [] },
          { id: 11, wins: 10, visits: 18, maxChildren: 0, children: [] }
        ]}
      ]},
      { id: 3, wins: 1, visits: 10, maxChildren: 2, children: [
        { id: 7, wins: 6, visits: 6, maxChildren: 0, children: [] },
        { id: 8, wins: 0, visits: 3, maxChildren: 0, children: [] }
      ]},
      { id: 4, wins: 2, visits: 11, maxChildren: 1, children: [
        { id: 9, wins: 3, visits: 4, maxChildren: 0, children: [] }
      ]}
    ]
  });

  const [nextId, setNextId] = useState(12);
  const [phase, setPhase] = useState('selection');
  const [selectedPath, setSelectedPath] = useState([]);
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  const [simulationNodeId, setSimulationNodeId] = useState(null);
  const [backpropagatePath, setBackpropagatePath] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);

  const width = 700;
  const height = 500;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const layoutWidth = width - margin.left - margin.right;
  const layoutHeight = height - margin.top - margin.bottom;
  const treeLayout = d3.tree().size([layoutWidth, layoutHeight]);

  const phaseText = {
    selection: "Step 1: Traverse the tree by selecting the most promising path.",
    selectionDone: "Path selected! Now expand a new node.",
    expansion: "Step 2: Expand by adding a new child node (representing a new move).",
    simulation: "Step 3: Simulate a random playthrough from the newly expanded node.",
    backpropagation: "Step 4: Backpropagate the simulation result up the selected path."
  };

  const handleNextStep = () => {
    setTreeData(prevTree => {
      const newTree = JSON.parse(JSON.stringify(prevTree));

      const selectPath = (node) => {
        const path = [node];
        while (node.children.length === node.maxChildren && node.children.length > 0) {
          node = node.children.reduce((best, child) => {
            const bestRate = best.visits > 0 ? best.wins / best.visits : 0;
            const childRate = child.visits > 0 ? child.wins / child.visits : 0;
            return childRate > bestRate ? child : best;
          }, node.children[0]);
          path.push(node);
        }
        return path;
      };

      const allNodes = [];
      const traverse = (node) => {
        allNodes.push(node);
        if (node.children) {
          node.children.forEach(traverse);
        }
      };
      traverse(newTree);

      if (phase === 'selection') {
        const path = selectPath(newTree);
        setSelectedPath(path.map(n => n.id));
        setPhase('expansion');
      } 
      else if (phase === 'expansion') {
        const nodeToExpand = allNodes.find(n => n.id === selectedPath[selectedPath.length - 1]);
        const newChild = {
          id: nextId,
          wins: 0,
          visits: 0,
          maxChildren: 0,
          children: []
        };
        nodeToExpand.children.push(newChild);
        setExpandedNodeId(nextId);
        setNextId(prev => prev + 1);

        setPhase('simulation');
      } 
      else if (phase === 'simulation') {
        const result = Math.random() < 0.5 ? 1 : 0;
        setSimulationResult(result);

        const allNodesAgain = [];
        const traverseAgain = (node) => {
          allNodesAgain.push(node);
          if (node.children) {
            node.children.forEach(traverseAgain);
          }
        };
        traverseAgain(newTree);

        const newNode = allNodesAgain.find(n => n.id === expandedNodeId);
        newNode.wins = result;
        newNode.visits = 1;

        setSimulationNodeId(expandedNodeId);
        setBackpropagatePath([expandedNodeId, ...selectedPath]);
        setExpandedNodeId(null);
        setPhase('backpropagation');
      } 
      else if (phase === 'backpropagation') {
        const allNodesAgain = [];
        const traverseAgain = (node) => {
          allNodesAgain.push(node);
          if (node.children) {
            node.children.forEach(traverseAgain);
          }
        };
        traverseAgain(newTree);

        backpropagatePath.forEach(id => {
          const node = allNodesAgain.find(n => n.id === id);
          if (node) {
            node.visits += 1;
            node.wins += simulationResult;
          }
        });

        setTimeout(() => {
          setSelectedPath([]);
          setExpandedNodeId(null);
          setSimulationNodeId(null);
          setBackpropagatePath([]);
          setSimulationResult(null);
          setPhase('selection');
        }, 1000);
      }

      return newTree;
    });
  };

  const root = d3.hierarchy(treeData);
  treeLayout(root);

  const getColorForDepth = (depth) => {
    return depth % 2 === 0 ? 'lightblue' : '#fcbba1';
  };

  const isConnectedInPath = (path, sourceId, targetId) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i] === sourceId && path[i+1] === targetId) ||
        (path[i] === targetId && path[i+1] === sourceId)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold mb-6">Monte Carlo Tree Walkthrough</h2>

      <svg width={width} height={height} className="bg-white shadow-md rounded">
        {/* Draw edges */}
        {root.links().map((link, index) => {
          const showSelection = (phase === 'expansion') && isConnectedInPath(selectedPath, link.source.data.id, link.target.data.id);
          const showBackprop = phase === 'backpropagation' &&
            backpropagatePath.includes(link.source.data.id) &&
            backpropagatePath.includes(link.target.data.id);

          return (
            <line
              key={index}
              x1={link.source.x + margin.left}
              y1={link.source.y + margin.top}
              x2={link.target.x + margin.left}
              y2={link.target.y + margin.top}
              stroke="black"
              strokeWidth={showSelection || showBackprop ? 4 : 1}
            />
          );
        })}

        {/* Draw nodes */}
        {root.descendants().map((node, index) => {
          const isExpandedNode = expandedNodeId === node.data.id;
          const isSimulationNode = (phase === 'simulation') && (simulationNodeId === node.data.id);
          const isSelectedNode = (phase === 'expansion') && selectedPath.includes(node.data.id);
          const isBackpropNode = phase === 'backpropagation' && backpropagatePath.includes(node.data.id);

          return (
            <g key={index}>
              <circle
                cx={node.x + margin.left}
                cy={node.y + margin.top}
                r={isExpandedNode || isSimulationNode ? 30 : 26}
                fill={
                  isExpandedNode ? "lightgreen" :
                  isSimulationNode ? "lightgreen" :
                  isSelectedNode || isBackpropNode ? "gold" :
                  getColorForDepth(node.depth)
                }
                stroke="black"
                strokeWidth={isSelectedNode || isExpandedNode || isBackpropNode ? 4 : 1}
              />
              <text
                x={node.x + margin.left}
                y={node.y + margin.top}
                dy={5}
                textAnchor="middle"
                className="text-xs font-bold"
              >
                {node.data.wins}/{node.data.visits}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Text explanation */}
      <p className="mt-8 text-lg text-center max-w-xl">{phaseText[phase]}</p>

      {/* Button */}
      <button 
        onClick={handleNextStep}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
      >
        {phase === 'selection' && 'Select Path'}
        {phase === 'expansion' && 'Expand Node'}
        {phase === 'simulation' && 'Simulate Playout'}
        {phase === 'backpropagation' && 'Backpropagate Result'}
      </button>
    </div>
  );
};

export default Walkthrough;
