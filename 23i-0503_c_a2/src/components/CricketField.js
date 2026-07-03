import React, { useRef, useEffect } from 'react';

function CricketField({ ballAnim, batAnim }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, 80);

      // Outfield 
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, 80, canvas.width, canvas.height - 80);

      // Pitch 
      ctx.fillStyle = '#c8a96e';
      ctx.fillRect(canvas.width / 2 - 30, 80, 60, canvas.height - 80);

      // Stumps
      ctx.fillStyle = '#fff';
      [-6, 0, 6].forEach(offset => {
        ctx.fillRect(canvas.width / 2 - 30 + 28 + offset, canvas.height - 70, 3, 30);
      });

      // Batsman 
      const batsmanX = canvas.width / 2 - 60;
      const batsmanY = canvas.height - 60;

      ctx.fillStyle = '#27ae60';
      // Body
      ctx.fillRect(batsmanX - 8, batsmanY - 40, 16, 30);
      // Head
      ctx.beginPath();
      ctx.arc(batsmanX, batsmanY - 50, 10, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.fillStyle = '#fff';
      ctx.fillRect(batsmanX - 8, batsmanY - 10, 7, 20);
      ctx.fillRect(batsmanX + 1, batsmanY - 10, 7, 20);

      // Bat
      ctx.fillStyle = '#8B4513';
      const batAngle = batAnim ? -0.6 : 0.3;
      ctx.save();
      ctx.translate(batsmanX + 8, batsmanY - 20);
      ctx.rotate(batAngle);
      ctx.fillRect(0, -4, 35, 8);
      ctx.restore();

      // Ball animation
      if (ballAnim > 0) {
        const progress = 1 - ballAnim; // 0=bowler end, 1=batsman
        const ballX = canvas.width / 2 - 30 + 30 + progress * (-80);
        const ballY = 100 + progress * (canvas.height - 160);
        ctx.fillStyle = '#cc2200';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();
        // Seam
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }
    };

    draw();
  }, [ballAnim, batAnim]);

  return (
    <div className="field-wrapper">
      <canvas
        ref={canvasRef}
        width={700}
        height={280}
        className="cricket-canvas"
      />
    </div>
  );
}

export default CricketField;