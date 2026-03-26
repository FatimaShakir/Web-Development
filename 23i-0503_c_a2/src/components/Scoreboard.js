import React from 'react';

function Scoreboard({ runs, wickets, ballsLeft, totalBalls }) {
  const ballsBowled = totalBalls - ballsLeft;
  const oversDisplay = `${Math.floor(ballsBowled / 6)}.${ballsBowled % 6}`;

  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="score-label">RUNS</span>
        <span className="score-value">{runs}</span>
      </div>
      <div className="score-item">
        <span className="score-label">WICKETS</span>
        <span className="score-value">{wickets}</span>
      </div>
      <div className="score-item">
        <span className="score-label">OVERS</span>
        <span className="score-value">{oversDisplay}</span>
      </div>
      <div className="score-item">
        <span className="score-label">BALLS LEFT</span>
        <span className="score-value">{ballsLeft}</span>
      </div>
    </div>
  );
}

export default Scoreboard;