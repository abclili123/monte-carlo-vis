import React from 'react';

const Recap = () => {
  return (
    <div className="flex flex-col items-center p-8 space-y-8">
      <h2 className="text-3xl font-bold mb-6">Monte Carlo Tree Search Recap</h2>

      {/* Steps Overview */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">Steps Summary</h3>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li><strong>Selection:</strong> Traverse the tree by selecting the most promising child nodes.</li>
          <li><strong>Expansion:</strong> Add a new child node if possible to explore a new move.</li>
          <li><strong>Simulation:</strong> Play a random game from the new node to the end.</li>
          <li><strong>Backpropagation:</strong> Update the statistics (Wins and Visits) along the path back to the root.</li>
        </ul>
      </div>

      {/* UCT Formula */}
      <div className="w-full max-w-2xl bg-purple-100 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">UCT Formula</h3>
        <p className="text-xl text-center mb-4">
          <code>UCT = (Wins / Visits) + c × √( log(Parent Visits) / Visits )</code>
        </p>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li><strong>Wins / Visits:</strong> Exploitation — choose moves that have performed well.</li>
          <li><strong>Exploration Term:</strong> Encourages visiting less-explored nodes.</li>
          <li><strong>c (Exploration Constant):</strong> Balances exploration and exploitation (commonly c ≈ 1.4).</li>
        </ul>
      </div>

      {/* Parameter Definitions */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">Definitions</h3>
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="border-b-2 pb-2">Term</th>
              <th className="border-b-2 pb-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Wins</td>
              <td className="py-2">Number of successful simulations for a node.</td>
            </tr>
            <tr>
              <td className="py-2">Visits</td>
              <td className="py-2">Number of times a node was selected during traversal.</td>
            </tr>
            <tr>
              <td className="py-2">c (exploration constant)</td>
              <td className="py-2">Controls the balance between exploration and exploitation.</td>
            </tr>
            <tr>
              <td className="py-2">N (simulations)</td>
              <td className="py-2">Total number of random playouts used to build the tree.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recap;
