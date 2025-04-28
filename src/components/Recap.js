import React from 'react';

const Recap = () => {
  return (
    <div>
      <h2>Monte Carlo Tree Search Recap</h2>

      {/* Steps Overview */}
      <div>
        <h3>Steps Summary</h3>
        <ul>
          <li><strong>Selection:</strong> Traverse the tree and select a node to expand. We can use UCT or a random selection policy.</li>
          <li><strong>Expansion:</strong> Add a new child node to explore a new move.</li>
          <li><strong>Simulation:</strong> Play a random game from the new node to the end. We can change the rollout policy depending on our use case.</li>
          <li><strong>Backpropagation:</strong> After seeing the simulation, update the win/ visit values along the traversed path.</li>
        </ul>
      </div>

      {/* UCT Formula */}
      <div>
        <h3>UCT Formula</h3>
        <p>
          UCT = (Wins / Visits) + c × √( log(Parent Visits) / Visits )
        </p>
        <ul>
          <li><strong>Wins / Visits:</strong> Our win rate represents exploitation.</li>
          <li><strong>Exploration Term:</strong> This represents how much we have explored the given node.</li>
          <li><strong>c (Exploration Constant):</strong> Balances exploration and exploitation by weighting exploration.</li>
        </ul>
      </div>

      {/* Parameter Definitions */}
      <div>
        <h3>Definitions</h3>
        <table>
          <thead>
            <tr>
              <th>Term</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Wins</td>
              <td>Number of successful simulations for a node.</td>
            </tr>
            <tr>
              <td>Visits</td>
              <td>Number of times a node was selected during traversal.</td>
            </tr>
            <tr>
              <td>C Value</td>
              <td>Controls the balance between exploration and exploitation.</td>
            </tr>
            <tr>
              <td>N Iterations</td>
              <td>Total number of random playouts used to build the tree.</td>
            </tr>
            <tr>
              <td>Rollout Policy</td>
              <td>Determines how we choose moves while simulating.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recap;
