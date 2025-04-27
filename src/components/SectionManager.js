import React, { useState } from 'react';
import Intro from './Intro';
import Why from './Why';
import Walkthrough from './Walkthrough';
import Recap from './Recap';

const SectionManager = () => {
  const [showRecap, setShowRecap] = useState(false);

  return (
    <div className="w-full">
      <section className="min-h-screen flex items-center justify-center bg-white">
        <Intro />
      </section>

      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <Why />
      </section>

      <section className="min-h-screen bg-white rounded-xl shadow-md flex items-center justify-center">
        <Walkthrough setShowRecap={setShowRecap} />
      </section>

      {showRecap && (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
          <Recap />
        </section>
      )}
    </div>
  );
};

export default SectionManager;
