import React, { useState, useEffect } from 'react';
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
  const [phase, setPhase] = useState('intro');
  const [selectedPath, setSelectedPath] = useState([]);
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  const [simulationNodeId, setSimulationNodeId] = useState(null);
  const [backpropagatePath, setBackpropagatePath] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [uctCyclesCompleted, setUctCyclesCompleted] = useState(0);
  const [autoSimulationsLeft, setAutoSimulationsLeft] = useState(-1);
  const [useUCTSelection, setUseUCTSelection] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  const width = 700;
  const height = 500;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const layoutWidth = width - margin.left - margin.right;
  const layoutHeight = height - margin.top - margin.bottom;
  const treeLayout = d3.tree().size([layoutWidth, layoutHeight]);

  const phaseText = {
    intro: "Here we have a partial MCTS. The root of the tree is the game state we are starting at. The blue nodes represent opponent moves, and the red nodes represent self moves. The numbers inside the nodes represent the number of wins / the number of visits to that node, but we will get to this later.",
    selection: "Step 1 - Selection\nFirst, we start at the root node, and traverse down the tree until we find a node to expand.",
    expansion: "Step 2 - Expansion:\nNext, we will expand the node by adding a new child node. This represents a new move.",
    simulation: "Step 3 - Simulation:\nHere, we will simulate a playthrough from this node. Depending on our implementation we can change our rollout policy, the move simulated, to either be random or based on game heuristics. We might even want to use a combination of both since we don't know if our opponent will play the perfect game!",
    backpropagation: "Step 4 - Backpropagation:\nAfter we simulate, we will now have a new value of wins/ number of times visited. At this step, we backpropagate the simulation result up the selected path.",
    introduceUCT: "Notice how we are only exploring the best-looking moves and ignoring others. This is where UCT helps balance exploration and exploitation!",
    finalMoveSelection: "Now we select the move with the highest win rate from the root. This represents the move the AI would play!"

  };

  const handleNextStep = () => {
    if (phase === 'introduceUCT' || phase === 'introduceNSimulations' || phase === 'finalMoveSelection') {
      return;
    }

    if (phase === 'backpropagation') {
      setButtonVisible(false);
    }

    setTreeData(prevTree => {
      const newTree = JSON.parse(JSON.stringify(prevTree));

      const selectPath = (node) => {
        const path = [node];
        while (node.children.length === node.maxChildren && node.children.length > 0) {
          node = node.children.reduce((best, child) => {
            const bestScore = calculateSelectionScore(best, node);
            const childScore = calculateSelectionScore(child, node);
            return childScore > bestScore ? child : best;
          }, node.children[0]);
          path.push(node);
        }
        return path;
      };
      
      const calculateSelectionScore = (node, parentNode) => {
        if (!useUCTSelection) {
          // Before UCT: just Win Rate
          return node.visits > 0 ? node.wins / node.visits : 0;
        }
        // After UCT is enabled:
        const winRate = node.visits > 0 ? node.wins / node.visits : 0;
        const exploration = Math.sqrt(Math.log(Math.max(parentNode.visits, 1)) / Math.max(node.visits, 1));
        const c = 5; // exploration parameter
        return winRate + c * exploration;
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

        let timeouttime = 1000;
        if (autoSimulationsLeft > 0) {
          timeouttime = 100
        }

        setTimeout(() => {
          setSelectedPath([]);
          setExpandedNodeId(null);
          setSimulationNodeId(null);
          setBackpropagatePath([]);
          setSimulationResult(null);
      
          if (!useUCTSelection) {
            setCyclesCompleted(prev => prev + 1);
            if (cyclesCompleted + 1 >= 3) {
              setPhase('introduceUCT');
            } else {
              setPhase('selection');
            }
          } else if (autoSimulationsLeft === -1 ){
            setUctCyclesCompleted(prev => prev + 1);
          
            if (uctCyclesCompleted + 1 >= 3) {
              setPhase('introduceNSimulations');
            } else {
              setPhase('selection');
            }
          } else if (autoSimulationsLeft >= 0) {
            setAutoSimulationsLeft(prev => {
              const newVal = prev - 1;
          
              if (newVal > 0) {
                setPhase('selection');
              } else {
                const rootChildren = newTree.children;
                if (rootChildren && rootChildren.length > 0) {
                  const bestChild = rootChildren.reduce((best, child) => {
                    const bestRate = best.visits > 0 ? best.wins / best.visits : 0;
                    const childRate = child.visits > 0 ? child.wins / child.visits : 0;
                    return childRate > bestRate ? child : best;
                  }, rootChildren[0]);
                  setSelectedPath([bestChild.id]);
                }
                setPhase('finalMoveSelection');
              
              }
          
              return newVal;
            });
          }
        }, timeouttime);
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
        (path[i] === sourceId && path[i + 1] === targetId) ||
        (path[i] === targetId && path[i + 1] === sourceId)
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (autoSimulationsLeft > 0 && phase !== 'introduceUCT' && phase !== 'introduceNSimulations') {
      setTimeout(() => {
        handleNextStep();
      }, 100); // 200ms delay between each simulation for animation
    }
  }, [autoSimulationsLeft, phase]);  

  useEffect(() => {
    setButtonVisible(true);
  }, [phase]);

  console.log(phase)
  return (
    <div>
      {/* Title on Top */}
      <h2
      >
        Monte Carlo Tree Walkthrough
      </h2>

      {/* SVG + Text Side-by-Side */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '32px',
          width: '100%',
        }}
      >
        {/* SVG on the left */}
        <div style={{ flexShrink: 0, width: "700px" }}>
          <svg
            width="100%"
            height={height}
            style={{
              backgroundColor: 'white',
            }}
          >
            {/* try to fix arrows later */}
            <defs>
              <marker id="arrow-down" markerWidth="20" markerHeight="20" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
              </marker>
              <marker id="arrow-up" markerWidth="20" markerHeight="20" refX="10" refY="5" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
              </marker>
            </defs>


            {/* Draw edges */}
            {root.links().map((link, index) => {
              const isSelectedLink = (phase === 'expansion') && isConnectedInPath(selectedPath, link.source.data.id, link.target.data.id);
              const isBackpropLink = (phase === 'backpropagation') &&
                backpropagatePath.includes(link.source.data.id) &&
                backpropagatePath.includes(link.target.data.id);
              
              let markerEnd = null;
              if (isBackpropLink) {
                markerEnd = "url(#arrow-up)";
              } else if (isSelectedLink && phase === 'expansion') {
                markerEnd = "url(#arrow-down)";
              }            

              return (
                <line
                  key={index}
                  x1={link.source.x + margin.left}
                  y1={link.source.y + margin.top}
                  x2={link.target.x + margin.left}
                  y2={link.target.y + margin.top}
                  stroke="black"
                  strokeWidth={isSelectedLink || isBackpropLink ? 4 : 1}
                  markerEnd={markerEnd}
                />
              );
            })}

            {/* Draw nodes */}
            {root.descendants().map((node, index) => {
              const isExpandedNode = expandedNodeId === node.data.id;
              const isSimulationNode = (phase === 'simulation') && (simulationNodeId === node.data.id);
              const isSelectedNode = (['expansion', 'finalMoveSelection'].includes(phase)) && selectedPath.includes(node.data.id);
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
        </div>

        {/* Text and Buttons on the right */}
        <div style={{ flex: 5, minWidth: 0 }}>
            {phase === 'introduceNSimulations' ? (
            // N Simulations explanation screen
            <div>
              <h3>Simulating Many Times</h3>
              <p>
                Great! We explored other paths. But, we only completed 6 interations. In MCTS, 
                we run many simulations to explore the tree before chosing a move.
              </p>
              <p>
                N = Number of simulations.<br/>
                Let's run N = 25 simulations automatically!
              </p>
              <button 
                onClick={() => {
                  setAutoSimulationsLeft(25);
                  setPhase('selection');
                }}
              >
                Start 25 Simulations
              </button>
            </div>
          ) : phase === 'introduceUCT' ? (
            // Special UCT screen
            <div>
              <h3>Introducing Upper Confidence Traversal</h3>
              <p>
                So far, you might have noticed that when selecting nodes, we are only exploring the node with the highest win rate.
                What we really want is balance between <b>exploiting</b> high win rates and <b>exploring</b> less visited nodes.
                There is where upper confidence traversal (UCT) comes in. We can use the following formula to select nodes:
              </p>
              <p>
                <strong>UCT Formula:</strong><br/>
                UCT = (Wins / Visits) + c × √( log(Parent Visits) / Visits )
              </p>
              <p>
                - The term on the left of the + is our win rate, the amount of wins at a given node, representing exploitation.<br/>
                - The term on the right of the + repesents exploration. It shows how much we have visited that node. The less amount
                of visits to that node, the smaller the denominator will be resulting in a larger exploration term.<br/>
                - c is a constant multiplying factor for our exploratory term, allowing us to weight exploration stronger!
              </p>
              <button 
                onClick={() => {
                  setUseUCTSelection(true);
                  setPhase('selection');
                }}
              >
                See walkthough with UCT!
              </button>
            </div>
          ) : phase === 'finalMoveSelection' ? (
            <div>
              <h3>Choosing the Move!</h3>
              <p>
                After many simulations, we now select the move with the highest win rate! See the highlighted node in yellow.
              </p>
              <p>
                Now that you understand how MCTS works, scroll down for a recap!
              </p>
            </div>
          ) : phase === 'intro' ? (
            <div>
              <p>{phaseText[phase]}</p>
              {buttonVisible && (
                <button 
                onClick={() => {
                  setPhase('selection');
                }}
                >
                  {phase === 'intro' && 'Start MCTS'}
                </button>
              )}
            </div>
          ) : (
            <>
              {autoSimulationsLeft > 0 ? (
                // Progress Bar during Auto Simulation
                <div>
                  <div>
                    <div
                      style={{
                        width: `${((25 - autoSimulationsLeft) / 25) * 100}%`,
                        transition: 'width 0.2s ease-in-out',
                      }}
                    />
                  </div>
                  <p>
                    Simulating {25 - autoSimulationsLeft} / 25
                  </p>
                </div>
              ) : (
                <>
                { ((cyclesCompleted === 1) && (phase === 'selection')) && (
                  <p>Now that we have walked through one interation, let's see two more!</p>
                )}
                  {cyclesCompleted === 0 && (<p>{phaseText[phase]}</p>)}
                  {buttonVisible && (
                    <button 
                      onClick={handleNextStep}
                    >
                      {phase === 'selection' && 'Select Path'}
                      {phase === 'expansion' && 'Expand Node'}
                      {phase === 'simulation' && 'Simulate Playout'}
                      {phase === 'backpropagation' && 'Backpropagate Result'}
                      {phase === 'intro' && 'Start MCTS'}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>

  );
};

export default Walkthrough;
