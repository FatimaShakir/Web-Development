import React from 'react';

function BattingControls({ style, onStyleChange, disabled }) {
  return (
    <div className="batting-controls">
      <p className="controls-label">Select Batting Style:</p>
      <div className="style-buttons">
        <button
          className={`style-btn aggressive ${style === 'aggressive' ? 'active' : ''}`}
          onClick={() => onStyleChange('aggressive')}
          disabled={disabled}
        >
          Aggressive
          <span className="style-desc">High Risk · High Reward</span>
        </button>
        <button
          className={`style-btn defensive ${style === 'defensive' ? 'active' : ''}`}
          onClick={() => onStyleChange('defensive')}
          disabled={disabled}
        >
          Defensive
          <span className="style-desc">Low Risk · Low Reward</span>
        </button>
      </div>
    </div>
  );
}

export default BattingControls;