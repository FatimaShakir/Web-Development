import React, { useState, useRef } from 'react';
import './App.css';
import CricketField from './components/CricketField';
import Scoreboard from './components/Scoreboard';
import PowerBar from './components/PowerBar';
import BattingControls from './components/BattingControls';
import GameOver from './components/GameOver';
import { AGGRESSIVE, DEFENSIVE } from './data/probabilities';

const TOTAL_BALLS = 12;
const MAX_WICKETS = 2;

function App() {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(TOTAL_BALLS);
  const [battingStyle, setBattingStyle] = useState('aggressive');
  const [gameOver, setGameOver] = useState(false);
  const [resultMsg, setResultMsg] = useState('Select style & click the bar!');
  const [ballAnim, setBallAnim] = useState(0);   // 0 = no ball, 1 = start anim
  const [batAnim, setBatAnim] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ballAnimRef = useRef(null);

  const probabilities = battingStyle === 'aggressive' ? AGGRESSIVE : DEFENSIVE;

  const animateBall = (callback) => {
    setIsAnimating(true);
    let progress = 1.0;
    const step = () => {
      progress -= 0.03;
      setBallAnim(progress);
      if (progress > 0) {
        ballAnimRef.current = requestAnimationFrame(step);
      } else {
        setBallAnim(0);
        callback();
      }
    };
    ballAnimRef.current = requestAnimationFrame(step);
  };

  const handleShot = (sliderPosition) => {
    if (isAnimating || gameOver) return;

    animateBall(() => {
      // Determine outcome from slider position
      let cumulative = 0;
      let outcome = null;
      for (const item of probabilities) {
        cumulative += item.probability;
        if (sliderPosition <= cumulative) {
          outcome = item.outcome;
          break;
        }
      }
      if (!outcome) outcome = probabilities[probabilities.length - 1].outcome;

      // Bat animation
      setBatAnim(true);
      setTimeout(() => setBatAnim(false), 400);

      // Update state
      const newBallsLeft = ballsLeft - 1;
      setBallsLeft(newBallsLeft);

      let msg = '';
      if (outcome === 'Wicket') {
        const newWickets = wickets + 1;
        setWickets(newWickets);
        msg = 'WICKET! You\'re out!';
        if (newWickets >= MAX_WICKETS || newBallsLeft <= 0) {
          setGameOver(true);
        }
      } else {
        const scored = parseInt(outcome);
        const newRuns = runs + scored;
        setRuns(newRuns);
        if (outcome === '6') msg = 'SIX! Massive hit!';
        else if (outcome === '4') msg = 'FOUR! Great shot!';
        else if (outcome === '0') msg = 'Dot ball. No run.';
        else msg = `${outcome} Run${scored > 1 ? 's' : ''}!`;
        if (newBallsLeft <= 0) setGameOver(true);
      }

      setResultMsg(msg);
      setIsAnimating(false);
    });
  };

  const handleRestart = () => {
    setRuns(0);
    setWickets(0);
    setBallsLeft(TOTAL_BALLS);
    setBattingStyle('aggressive');
    setGameOver(false);
    setResultMsg('Select style & click the bar!');
    setBallAnim(0);
    setBatAnim(false);
    setIsAnimating(false);
  };

  return (
    <div className="app">
      <h1 className="app-title">2D Cricket Game</h1>

      <Scoreboard
        runs={runs}
        wickets={wickets}
        ballsLeft={ballsLeft}
        totalBalls={TOTAL_BALLS}
      />

      <CricketField ballAnim={ballAnim} batAnim={batAnim} />

      <div className="result-msg">{resultMsg}</div>

      <BattingControls
        style={battingStyle}
        onStyleChange={setBattingStyle}
        disabled={isAnimating || gameOver}
      />

      <PowerBar
        probabilities={probabilities}
        onShot={handleShot}
        isActive={!isAnimating && !gameOver}
      />

      {gameOver && (
        <GameOver runs={runs} wickets={wickets} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;