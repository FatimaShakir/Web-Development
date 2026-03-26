import React from 'react';

function GameOver({ runs, wickets, onRestart }) {
  return (
    <div className="gameover-overlay">
      <div className="gameover-card">
        <h1>Innings Over!</h1>
        <div className="final-score">
          <p>Final Score</p>
          <h2>{runs}/{wickets}</h2>
          <span>Runs / Wickets</span>
        </div>
        <button className="restart-btn" onClick={onRestart}>
            Play Again
        </button>
      </div>
    </div>
  );
}

export default GameOver;