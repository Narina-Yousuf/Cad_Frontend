import React, { useEffect, useRef } from "react";

export const ECGWaveform: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Background Grid - Updated to match Amethyst theme
    const drawGrid = () => {
      ctx.strokeStyle = "rgba(124, 93, 250, 0.1)"; // Very faint purple grid
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    };

    const draw = () => {
      const step = 2;
      const noise = Math.random() * 4;
      let y = centerY + noise;

      // Heart beat logic
      if (x % 120 > 40 && x % 120 < 50) y -= 60; // R-wave (sharper spike)
      if (x % 120 > 50 && x % 120 < 55) y += 20; // S-wave

      // Line Glow Effect
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#7c5dfa";
      ctx.strokeStyle = "#7c5dfa"; // Amethyst Purple
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x + step, y);
      ctx.stroke();

      // Reset Shadow for clearing logic
      ctx.shadowBlur = 0;

      x += step;

      // Reset and clear leading edge
      if (x > width) {
        x = 0;
        ctx.fillStyle = "#1a1a2e"; // Match brand background
        ctx.fillRect(0, 0, width, height);
        drawGrid();
      } else {
        // Clear a box ahead of the line to create a "scanning" effect
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(x + 2, 0, 30, height);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Initial Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);
    drawGrid();
    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full bg-[#1a1a2e] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-64 md:h-80"
      />
    </div>
  );
};
