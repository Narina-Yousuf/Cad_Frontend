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

    // Background Grid - Updated to Clean Clinical Slate
    const drawGrid = () => {
      ctx.strokeStyle = "#f1f5f9"; // Very light slate grid (Slate-100)
      ctx.lineWidth = 1;
      
      // Vertical Grid Lines
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      // Horizontal Grid Lines
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    };

    const draw = () => {
      const step = 2;
      const noise = (Math.random() - 0.5) * 3; // Subtle baseline wander
      let y = centerY + noise;

      // Professional Heartbeat Logic (P-Q-R-S-T)
      const pos = x % 160;
      if (pos > 30 && pos < 40) y -= 5;   // P-wave
      if (pos > 50 && pos < 55) y += 5;   // Q-wave
      if (pos > 55 && pos < 62) y -= 70;  // R-wave (Main spike)
      if (pos > 62 && pos < 68) y += 25;  // S-wave
      if (pos > 90 && pos < 110) y -= 12; // T-wave

      // Line Glow Effect - Sky Blue
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(14, 165, 233, 0.3)";
      ctx.strokeStyle = "#0ea5e9"; // Sky Blue
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(x, centerY); // Use previous Y if storing state, or centerY for simplicity
      ctx.lineTo(x + step, y);
      ctx.stroke();

      // Reset Shadow for clearing logic
      ctx.shadowBlur = 0;

      x += step;

      // Reset and clear leading edge
      if (x > width) {
        x = 0;
        ctx.fillStyle = "#ffffff"; // White Canvas Background
        ctx.fillRect(0, 0, width, height);
        drawGrid();
      } else {
        // "Scanning" effect: clear a small window ahead of the drawing point
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 2, 0, 40, height);
        
        // Redraw grid lines in the cleared window area so they don't disappear
        ctx.strokeStyle = "#f1f5f9";
        ctx.lineWidth = 1;
        const gridX = Math.floor((x + 2) / 40) * 40 + 40;
        if (gridX < x + 42) {
            ctx.beginPath();
            ctx.moveTo(gridX, 0);
            ctx.lineTo(gridX, height);
            ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Initial State
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    drawGrid();
    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/5 border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Lead II - V5</span>
        </div>
        <span className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest">68 BPM</span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-48 md:h-64 rounded-2xl"
      />
    </div>
  );
};