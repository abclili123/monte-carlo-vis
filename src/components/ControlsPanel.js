import React, { useState } from 'react';

const ControlsPanel = ({ nIterations, cValue, onUpdateParameters, onToggleTree }) => {
  const [nInput, setNInput] = useState(nIterations);
  const [cInput, setCInput] = useState(cValue);

  const handleUpdateClick = () => {
    onUpdateParameters(Number(nInput), Number(cInput));
  };

  return (
    <div
      style={{
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        N Iterations:
        <input
          type="number"
          value={nInput}
          onChange={(e) => setNInput(e.target.value)}
          style={{ width: '80px' }}
        />
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        C Value:
        <input
          type="number"
          step="0.1"
          value={cInput}
          onChange={(e) => setCInput(e.target.value)}
          style={{ width: '80px' }}
        />
      </label>

      <button onClick={handleUpdateClick} style={{ padding: '6px 12px' }}>
        Update Parameters
      </button>

      <button onClick={onToggleTree} style={{ padding: '6px 12px' }}>
        Toggle Tree
      </button>
    </div>
  );
};

export default ControlsPanel;