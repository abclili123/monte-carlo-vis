import React from 'react';

const Recap = () => {
  return (
    <div>
      <h2>Monte Carlo Tree Search Recap</h2>

      {/* Steps Overview */}
      <div>
        <h3>Steps Summary</h3>
        <ul>
          <li><strong>Selection:</strong> Traverse the tree by selecting the most promising child nodes.</li>
          <li><strong>Expansion:</strong> Add a new child node if possible to explore a new move.</li>
          <li><strong>Simulation:</strong> Play a random game from the new node to the end.</li>
          <li><strong>Backpropagation:</strong> Update the statistics (Wins and Visits) along the path back to the root.</li>
        </ul>
      </div>

      {/* UCT Formula */}
      <div>
        <h3>UCT Formula</h3>
        <p>
          <code>UCT = (Wins / Visits) + c × √( log(Parent Visits) / Visits )</code>
        </p>
        <ul>
          <li><strong>Wins / Visits:</strong> Exploitation — choose moves that have performed well.</li>
          <li><strong>Exploration Term:</strong> Encourages visiting less-explored nodes.</li>
          <li><strong>c (Exploration Constant):</strong> Balances exploration and exploitation (commonly c ≈ 1.4).</li>
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
              <td>c (exploration constant)</td>
              <td>Controls the balance between exploration and exploitation.</td>
            </tr>
            <tr>
              <td>N (simulations)</td>
              <td>Total number of random playouts used to build the tree.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recap;
