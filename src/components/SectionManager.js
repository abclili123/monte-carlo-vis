import React, { useState } from 'react';
import Intro from './Intro';
import Why from './Why';
import Walkthrough from './Walkthrough';
import Recap from './Recap';
import ExploreWhilePlaying from './Explore';

const SectionManager = () => {
  const [showRecap, setShowRecap] = useState(true);

  return (
    <div className="w-full">
      <section >
        <Intro />
      </section>

      <section >
        <Walkthrough setShowRecap={setShowRecap} />
      </section>

      {showRecap && (
        <section >
          <Recap />
        </section>
      )}

      {showRecap && (
        <section >
          <ExploreWhilePlaying />
        </section>
      )}
    </div>
  );
};

export default SectionManager;
