import React, { useEffect, useRef, useCallback, useState } from 'react';

interface StageData {
  label: string;
  subtitles: string[];
  // Position along the curve (0–1)
  t: number;
  color: string;
}

const stages: StageData[] = [
  {
    label: 'PERCEPTION AI',
    subtitles: ['Speech Recognition', 'Deep Learning', 'Medical Diagnosis'],
    t: 0.15,
    color: '#4ade80',
  },
  {
    label: 'GENERATIVE AI',
    subtitles: ['Digital Marketing', 'Content Creation'],
    t: 0.4,
    color: '#22d3ee',
  },
  {
    label: 'AGENTIC AI',
    subtitles: ['Coding Assistant', 'Customer Service', 'Patient Care'],
    t: 0.65,
    color: '#a3e635',
  },
  {
    label: 'PHYSICAL AI',
    subtitles: ['Self-Driving Cars', 'General Robotics'],
    t: 0.9,
    color: '#84cc16',
  },
];

// easeOutCubic for smooth deceleration
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

const PhysicalAIEvolutionChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [dotPositions, setDotPositions] = useState<
    Array<{ x: number; y: number; color: string; delay: number }>
  >([]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cancel any previous animation
    cancelAnimationFrame(animationRef.current);

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    if (width <= 0) return;

    const isMobile = width < 640;
    const height = isMobile
      ? Math.max(420, width * 0.85)
      : Math.max(400, Math.min(480, width * 0.42));

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Padding
    const padLeft = isMobile ? 30 : 50;
    const padRight = isMobile ? 40 : 60;
    const padTop = isMobile ? 40 : 50;
    const padBottom = isMobile ? 60 : 60;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Exponential curve function
    const curveX = (t: number) => padLeft + t * plotW;
    const curveY = (t: number) => {
      const exp = Math.pow(t, 1.8);
      return padTop + plotH - exp * plotH;
    };

    // Generate curve points
    const curvePoints: { x: number; y: number }[] = [];
    const numPoints = 200;
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      curvePoints.push({ x: curveX(t), y: curveY(t) });
    }

    const animDuration = 120; // ~2 seconds at 60fps
    let frameCount = 0;

    // Helper: draw everything up to a given progress (0..1)
    const drawFrame = (progress: number, animDone: boolean) => {
      // Reset transform and clear
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const visiblePoints = Math.floor(progress * curvePoints.length);

      // Background subtle grid (always fully visible)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSpacing = isMobile ? 40 : 60;
      for (let x = padLeft; x <= width - padRight; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, padTop);
        ctx.lineTo(x, height - padBottom);
        ctx.stroke();
      }
      for (let y = padTop; y <= height - padBottom; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();
      }

      // Draw soft glow behind the curve (layered strokes, no filter)
      if (visiblePoints > 1) {
        const glowPasses = [
          { lw: 16, alpha: 0.04 },
          { lw: 10, alpha: 0.06 },
          { lw: 6, alpha: 0.08 },
        ];
        glowPasses.forEach(({ lw, alpha }) => {
          ctx.beginPath();
          ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
          for (let i = 1; i < visiblePoints; i++) {
            ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
          }
          ctx.strokeStyle = `rgba(132, 204, 22, ${alpha})`;
          ctx.lineWidth = lw;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        });
      }

      // Draw main curve with gradient
      if (visiblePoints > 1) {
        const gradient = ctx.createLinearGradient(
          padLeft,
          0,
          width - padRight,
          0,
        );
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(0.3, '#22d3ee');
        gradient.addColorStop(0.6, '#a3e635');
        gradient.addColorStop(1, '#84cc16');

        ctx.beginPath();
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
        for (let i = 1; i < visiblePoints; i++) {
          ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Arrow at the end (only when animation is done)
      if (animDone) {
        const lastPt = curvePoints[curvePoints.length - 1];
        const prevPt = curvePoints[curvePoints.length - 5];
        const angle = Math.atan2(lastPt.y - prevPt.y, lastPt.x - prevPt.x);
        const arrowSize = isMobile ? 14 : 18;

        ctx.save();
        ctx.translate(lastPt.x, lastPt.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(arrowSize, 0);
        ctx.lineTo(-arrowSize * 0.6, -arrowSize * 0.5);
        ctx.lineTo(-arrowSize * 0.6, arrowSize * 0.5);
        ctx.closePath();
        ctx.fillStyle = '#84cc16';
        ctx.shadowColor = 'rgba(132, 204, 22, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();

        // Arrow glow
        ctx.save();
        ctx.translate(lastPt.x, lastPt.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(arrowSize * 1.2, 0);
        ctx.lineTo(-arrowSize * 0.8, -arrowSize * 0.7);
        ctx.lineTo(-arrowSize * 0.8, arrowSize * 0.7);
        ctx.closePath();
        ctx.fillStyle = 'rgba(132, 204, 22, 0.15)';
        ctx.fill();
        ctx.restore();
      }

      // Draw stages — fade in as the curve reaches them
      stages.forEach((stage, idx) => {
        const sx = curveX(stage.t);
        const sy = curveY(stage.t);

        // Calculate fade-in: 0 when curve hasn't reached, 1 when fully past
        const stageAlpha = Math.min(
          1,
          Math.max(0, (progress - stage.t + 0.05) / 0.1),
        );
        if (stageAlpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = stageAlpha;

        const dotRadius = isMobile ? 5 : 7;
        const isPhysicalAI = idx === stages.length - 1;

        // Static glow ring
        ctx.beginPath();
        ctx.arc(sx, sy, dotRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${stage.color}1F`;
        ctx.fill();

        // Outer dot
        ctx.beginPath();
        ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = stage.color;
        ctx.shadowColor = stage.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner dot
        ctx.beginPath();
        ctx.arc(sx, sy, dotRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Label positioning
        const labelFontSize = isMobile ? 11 : 15;
        const subtitleFontSize = isMobile ? 9 : 11;
        const subtitleLineH = subtitleFontSize + 5;
        const blockHeight =
          labelFontSize + stage.subtitles.length * subtitleLineH;

        let labelX: number, labelY: number;
        let textAlign: CanvasTextAlign = 'right';

        if (isMobile) {
          labelX = sx - dotRadius - 10;
          labelY = sy - blockHeight - 8;
          textAlign = 'right';
          if (labelX - 120 < 0) {
            labelX = sx + dotRadius + 10;
            textAlign = 'left';
          }
          if (labelY < 10) {
            labelY = sy + dotRadius + 18;
          }
        } else {
          const yOffset = idx === 0 ? 80 : idx === 1 ? 60 : idx === 2 ? 50 : 35;
          labelX = sx - 25;
          labelY = sy - yOffset;
          textAlign = 'right';
          if (isPhysicalAI) {
            labelX = sx - 25;
            labelY = sy - 55;
          }
        }

        // Connector line
        const connEndX = labelX + (textAlign === 'right' ? -5 : 5);
        const connEndY = labelY + labelFontSize + 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(connEndX, connEndY);
        ctx.strokeStyle = `${stage.color}50`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small dot at connector end
        ctx.beginPath();
        ctx.arc(connEndX, connEndY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${stage.color}60`;
        ctx.fill();

        // Stage label
        ctx.save();
        ctx.font = `bold ${labelFontSize}px 'Inter', sans-serif`;
        ctx.fillStyle = stage.color;
        ctx.textAlign = textAlign;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(stage.label, labelX, labelY);
        if (isPhysicalAI) {
          ctx.shadowColor = `${stage.color}80`;
          ctx.shadowBlur = 20;
          ctx.fillText(stage.label, labelX, labelY);
        }
        ctx.restore();

        // Subtitles
        ctx.save();
        ctx.font = `${subtitleFontSize}px 'Inter', sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = textAlign;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 4;
        stage.subtitles.forEach((sub, si) => {
          ctx.fillText(sub, labelX, labelY + (si + 1) * subtitleLineH);
        });
        ctx.restore();

        // Restore globalAlpha
        ctx.restore();
      });

      // Origin marker
      const originX = curveX(0.05);
      const originY = curveY(0.05);
      ctx.font = `${isMobile ? 8 : 10}px 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.textAlign = 'left';
      ctx.fillText('2012 ALEXNET', originX - 10, originY + 20);
    };

    // Animation loop — runs for ~2 seconds then stops
    const animate = () => {
      frameCount++;
      const rawProgress = Math.min(frameCount / animDuration, 1);
      const progress = easeOutCubic(rawProgress);
      const animDone = rawProgress >= 1;

      drawFrame(progress, animDone);

      if (!animDone) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation done — compute dot positions for CSS pulse overlays
        const dots = stages.map((stage, idx) => ({
          x: curveX(stage.t),
          y: curveY(stage.t),
          color: stage.color,
          delay: idx * 0.4,
        }));
        setDotPositions(dots);
      }
    };

    animate();
  }, []);

  // Draw on mount and re-draw on resize
  useEffect(() => {
    drawChart();

    const handleResize = () => {
      drawChart();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawChart]);

  return (
    <div
      ref={containerRef}
      className='physical-ai-evolution-chart w-full'
      style={{ position: 'relative' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
      {/* CSS-animated pulse rings overlaid on top of the static canvas */}
      {dotPositions.map((dot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: `2px solid ${dot.color}`,
              opacity: 0,
              animation: `dotPulse 2s ease-out ${dot.delay}s infinite`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes dotPulse {
          0% {
            transform: scale(0.5);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PhysicalAIEvolutionChart;
