import React from 'react';

const Intro = () => {
  return (
    <div>
      <h2>What is Monte Carlo Tree Search (MCTS)?</h2>
      <p>
        Monte Carlo Tree Search (MCTS) is a clever algorithm that helps computers make decisions by simulating many possible futures.
        Instead of trying to plan everything perfectly in advance, MCTS plays out lots of random games and uses the results to decide which moves look promising.
      </p>
      <p>
        It builds a tree of possibilities, getting smarter as it explores more — balancing between exploring new moves and exploiting known good ones.
      </p>
    </div>
  );
};

export default Intro;
