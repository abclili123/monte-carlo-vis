import React from 'react';

const Intro = () => {
  return (
    <div>
      <h2>What is Monte Carlo Tree Search (MCTS)?</h2>
      <p>
        Monte Carlo Tree Search (MCTS) is an algorithm used to make decisions by simulating many possible futures.
        While other algorithms, such as minimax, attempt to plan out entire futures, this is impractical for larger games 
        since terminal nodes must be found.
      </p>
      <p>
        MCTS works by turning non-terminal nodes into terminals using an estimate of that node's state. 
        This means, it builds a tree of possibilities, keeping track of the probabiliity of a successful outcome at each state.
        The estimated state can be used to treat non-terminals as terminals! Similar to other algorithms, we can define a selection policy in order to balance exploring the tree and exploiting 
        advantageous outcomes. 
      </p>
      <p>
        MCTS works in 4 steps: Selection - Expansion - Simulation - Backpropagation.
        If you are ready to dive in, click through the walthough below!
      </p>
    </div>
  );
};

export default Intro;
