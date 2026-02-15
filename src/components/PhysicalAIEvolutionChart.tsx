import React, { useEffect, useRef, useState } from 'react';

interface StageData {
  label: string;
  subtitles: string[];
  // Position along the curve (0–1)
  t: number;
  color: string;
  glowColor: string;
}

const stages: StageData[] = [
  {
    label: 'PERCEPTION AI',
    subtitles: ['Speech Recognition', 'Deep Learning', 'Medical Diagnosis'],
    t: 0.15,
    color: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.5)',
  },
  {
    label: 'GENERATIVE AI',
    subtitles: ['Digital Marketing', 'Content Creation'],
    t: 0.4,
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.5)',
  },
  {
    label: 'AGENTIC AI',
    subtitles: ['Coding Assistant', 'Customer Service', 'Patient Care'],
    t: 0.65,
    color: '#a3e635',
    glowColor: 'rgba(163, 230, 53, 0.5)',
  },
  {
    label: 'PHYSICAL AI',
    subtitles: ['Self-Driving Cars', 'General Robotics'],
    t: 0.9,
    color: '#84cc16',
    glowColor: 'rgba(132, 204, 22, 0.6)',
  },
];

const PhysicalAIEvolutionChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  // Responsive sizing
  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = rect.width;
        const isMobile = w < 640;
        const h = isMobile
          ? Math.max(520, w * 0.95)
          : Math.max(520, Math.min(620, w * 0.55));
        setDimensions({ width: w, height: h });
      }
    };
    window.addEventListener('resize', updateDims);
    updateDims();
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const { width, height } = dimensions;
    const isMobile = width < 640;

    // Padding — generous top/bottom for labels that extend beyond the curve
    const padLeft = isMobile ? 30 : 60;
    const padRight = isMobile ? 40 : 80;
    const padTop = isMobile ? 50 : 70;
    const padBottom = isMobile ? 80 : 90;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Exponential curve function
    const curveX = (t: number) => padLeft + t * plotW;
    const curveY = (t: number) => {
      // Exponential growth: y goes from bottom to top
      const exp = Math.pow(t, 1.8);
      return padTop + plotH - exp * plotH;
    };

    // Generate curve points for smooth rendering
    const curvePoints: { x: number; y: number }[] = [];
    const numPoints = 200;
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      curvePoints.push({ x: curveX(t), y: curveY(t) });
    }

    let frameCount = 0;
    const animDuration = 120; // frames (~2 seconds at 60fps)

    // easeOutCubic for smooth deceleration
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // Animation progress: 0 → 1 over animDuration frames, then stays at 1
      const rawProgress = Math.min(frameCount / animDuration, 1);
      const progress = easeOutCubic(rawProgress);
      const animDone = rawProgress >= 1;

      // How many curve points to draw
      const visiblePoints = Math.floor(progress * curvePoints.length);

      // Background subtle grid
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

      // Draw the main glow behind the curve (only visible portion)
      if (visiblePoints > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
        for (let i = 1; i < visiblePoints; i++) {
          ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
        }
        ctx.strokeStyle = 'rgba(132, 204, 22, 0.15)';
        ctx.lineWidth = 20;
        ctx.filter = 'blur(12px)';
        ctx.stroke();
        ctx.restore();
      }

      // Draw curve with gradient (only visible portion)
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

      // Arrow at the tip of the visible curve (only when animation is done)
      if (animDone && visiblePoints > 5) {
        const lastPt = curvePoints[curvePoints.length - 1];
        const prevPt = curvePoints[curvePoints.length - 5];
        const angle = Math.atan2(lastPt.y - prevPt.y, lastPt.x - prevPt.x);
        const arrowSize = isMobile ? 14 : 18;

        // Draw arrow head
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

      // Draw stages — only show when the curve has reached them
      stages.forEach((stage, idx) => {
        const sx = curveX(stage.t);
        const sy = curveY(stage.t);

        // Calculate how far the curve has progressed relative to this stage
        const stageProgress = Math.min(
          1,
          Math.max(0, (progress - stage.t + 0.05) / 0.1),
        );
        if (stageProgress <= 0) return; // Not visible yet
        const stageAlpha = stageProgress; // Fade in as the curve reaches the stage

        // Apply fade-in alpha to all stage rendering
        ctx.save();
        ctx.globalAlpha = stageAlpha;

        // Pulsing dot on the curve
        const pulse = Math.sin(frameCount * 0.05 + idx * 1.5) * 0.3 + 0.7;
        const dotRadius = isMobile ? 5 : 7;

        // Glow ring
        ctx.beginPath();
        ctx.arc(sx, sy, dotRadius * 2.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = stage.glowColor.replace(
          /[\d.]+\)$/,
          `${0.15 * pulse})`,
        );
        ctx.fill();

        // Outer dot
        ctx.beginPath();
        ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = stage.color;
        ctx.shadowColor = stage.glowColor;
        ctx.shadowBlur = 12;
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
        const isPhysicalAI = idx === stages.length - 1;
        const subtitleLineH = subtitleFontSize + 5;

        // Calculate how many lines the label block needs
        const blockHeight =
          labelFontSize + stage.subtitles.length * subtitleLineH;

        // Text position: all labels go to the TOP-LEFT of the dot
        let labelX: number, labelY: number;
        let textAlign: CanvasTextAlign = 'right';

        if (isMobile) {
          // Mobile: labels go top-left of the dot
          labelX = sx - dotRadius - 10;
          labelY = sy - blockHeight - 8;
          textAlign = 'right';

          // If label goes off left edge, flip to the right side
          if (labelX - 120 < 0) {
            labelX = sx + dotRadius + 10;
            textAlign = 'left';
          }
          // If label goes above canvas top, push it below
          if (labelY < 10) {
            labelY = sy + dotRadius + 18;
          }
        } else {
          // Desktop: position labels at top-left of each dot
          // Perception AI needs to be higher than others to separate from origin text
          const yOffset = idx === 0 ? 80 : idx === 1 ? 60 : idx === 2 ? 50 : 35;
          const xOffset = 25;
          labelX = sx - xOffset;
          labelY = sy - yOffset;
          textAlign = 'right';

          // Physical AI special case: push label further up for emphasis
          if (isPhysicalAI) {
            labelX = sx - 25;
            labelY = sy - 55;
          }
        }

        // Draw connector line from dot to label area
        const connectorEndX = labelX + (textAlign === 'right' ? -5 : 5);
        const connectorEndY = labelY + labelFontSize + 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(connectorEndX, connectorEndY);
        ctx.strokeStyle = `${stage.color}50`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small dot at connector end
        ctx.beginPath();
        ctx.arc(connectorEndX, connectorEndY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${stage.color}60`;
        ctx.fill();

        // Stage label with dark shadow for readability
        ctx.save();
        ctx.font = `bold ${labelFontSize}px 'Inter', sans-serif`;
        ctx.fillStyle = stage.color;
        ctx.textAlign = textAlign;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(stage.label, labelX, labelY);
        // Extra glow for Physical AI
        if (isPhysicalAI) {
          ctx.shadowColor = stage.glowColor;
          ctx.shadowBlur = 20;
          ctx.fillText(stage.label, labelX, labelY);
        }
        ctx.restore();

        // Subtitles with dark shadow
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

        // Restore globalAlpha from stageAlpha
        ctx.restore();
      });

      // Draw origin marker (2012 AlexNet reference)
      const originX = curveX(0.05);
      const originY = curveY(0.05);
      ctx.font = `${isMobile ? 8 : 10}px 'Inter', sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.textAlign = 'left';
      ctx.fillText('2012 ALEXNET', originX - 10, originY + 20);

      // Keep animating only during the draw-in; stop once done
      if (!animDone) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions]);

  return (
    <div ref={containerRef} className='physical-ai-evolution-chart w-full'>
      <canvas
        ref={canvasRef}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'block',
        }}
      />
    </div>
  );
};

export default PhysicalAIEvolutionChart;
