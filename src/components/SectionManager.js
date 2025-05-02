import React, { useState } from 'react';
import Intro from './Intro';
import Why from './Why';
import Walkthrough from './Walkthrough';
import Recap from './Recap';
import ExploreWhilePlaying from './Explore';
import References from './References';

const SectionManager = () => {
  return (
    <div className="w-full">
      <section >
        <Intro />
      </section>

      <section >
        <Walkthrough/>
      </section>

      <section >
        <Recap />
      </section>

      <section >
        <ExploreWhilePlaying />
      </section>

      <section >
        <References />
      </section>

    </div>
  );
};

export default SectionManager;
