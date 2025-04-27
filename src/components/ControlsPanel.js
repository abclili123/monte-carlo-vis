import React, { useState } from 'react';

const ControlsPanel = ({ nIterations, cValue, onUpdateParameters, onToggleTree }) => {
  const [nInput, setNInput] = useState(nIterations);
  const [cInput, setCInput] = useState(cValue);

  const handleUpdateClick = () => {
    onUpdateParameters(Number(nInput), Number(cInput));
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium">N Iterations</label>
          <input
            type="number"
            className="border rounded p-1 w-24"
            value={nInput}
            onChange={(e) => setNInput(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">C Value</label>
          <input
            type="number"
            className="border rounded p-1 w-24"
            step="0.1"
            value={cInput}
            onChange={(e) => setCInput(e.target.value)}
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleUpdateClick}
        >
          Update
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          onClick={onToggleTree}
        >
          Toggle Tree
        </button>
      </div>
    </div>
  );
};

export default ControlsPanel;
