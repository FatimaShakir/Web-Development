import React, { useEffect, useRef, useState } from 'react';

function PowerBar({ probabilities, onShot, isActive }) {
  const [sliderPos, setSliderPos] = useState(0);
  const dirRef = useRef(1);
  const posRef = useRef(0);
  const animRef = useRef(null);
  const speed = 0.008;

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(animRef.current);
      return;
    }

    const animate = () => {
      posRef.current += speed * dirRef.current;
      if (posRef.current >= 1) { posRef.current = 1; dirRef.current = -1; }
      if (posRef.current <= 0) { posRef.current = 0; dirRef.current = 1; }
      setSliderPos(posRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive]);

  const handlePlayShot = () => {
    if (!isActive) return;
    cancelAnimationFrame(animRef.current);
    onShot(posRef.current);
  };

  let cumulative = 0;
  const segments = probabilities.map((item) => {
    const seg = { ...item, start: cumulative };
    cumulative += item.probability;
    return seg;
  });

  return (
    <div className="powerbar-wrapper">
      <p className="powerbar-label">Watch the slider and press <strong>Play</strong>!</p>

      {/* Bar + Button on same row */}
      <div className="powerbar-row">

        {/* Power Bar */}
        <div className="powerbar-container">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="powerbar-segment"
              style={{
                width: `${seg.probability * 100}%`,
                backgroundColor: seg.color,
              }}
            >
              <span className="segment-label">{seg.outcome}</span>
            </div>
          ))}

          {/* Slider marker */}
          <div
            className="slider-marker"
            style={{ left: `${sliderPos * 100}%` }}
          />
        </div>

        {/* Play Shot Button — same row as bar */}
        <div className="playshot-btn-wrapper">
          <button
            className="playshot-btn"
            onClick={handlePlayShot}
            disabled={!isActive}
          >
            Play
          </button>
        </div>

      </div>

      {/* Percentage labels below bar only */}
      <div className="powerbar-labels">
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              width: `${seg.probability * 100}%`,
              textAlign: 'center',
              fontSize: '11px',
              color: '#ccc',
            }}
          >
            {(seg.probability * 100).toFixed(0)}%
          </div>
        ))}
      </div>

    </div>
  );
}

export default PowerBar;