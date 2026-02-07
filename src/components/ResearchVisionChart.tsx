import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ResearchVisionChartProps {
  onAreaClick?: (areaId: string) => void;
}

interface TooltipData {
  label: string;
  description: string;
  x: number;
  y: number;
}

const ResearchVisionChart: React.FC<ResearchVisionChartProps> = ({
  onAreaClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Responsive sizing
  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.max(600, Math.min(900, rect.width));
        setDimensions({
          width: w,
          height: Math.max(450, w * 0.55),
        });
      }
    };
    window.addEventListener('resize', updateDims);
    updateDims();
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Render unified visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const scale = Math.min(width / 800, height / 500);

    // Main ecosystem center
    const ecoX = width * 0.35;
    const ecoY = height * 0.5;

    // Zoom callout position (to the right)
    const zoomX = width * 0.72;
    const zoomY = height * 0.5;
    const zoomRadius = 100 * scale;

    // Defs
    const defs = svg.append('defs');

    // Glow filter
    const glow = defs.append('filter').attr('id', 'glow');
    glow
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Human gradient
    const humanGradient = defs
      .append('radialGradient')
      .attr('id', 'humanGradient')
      .attr('cx', '40%')
      .attr('cy', '40%')
      .attr('r', '60%');
    humanGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fef9e7');
    humanGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f7dc6f');

    const g = svg.append('g');

    // ===== ECOSYSTEM (LEFT SIDE) =====

    // Environment outer ellipse
    g.append('ellipse')
      .attr('cx', ecoX)
      .attr('cy', ecoY)
      .attr('rx', 180 * scale)
      .attr('ry', 140 * scale)
      .attr('fill', 'rgba(245, 215, 110, 0.12)')
      .attr('stroke', '#f5d76e')
      .attr('stroke-width', 2);

    // Environment label
    g.append('text')
      .attr('x', ecoX)
      .attr('y', ecoY - 100 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a08050')
      .attr('font-size', `${16 * scale}px`)
      .attr('font-weight', 'bold')
      .text('Environment (Agent)');

    // CAREGIVER circle (left in ecosystem)
    const caregiverX = ecoX - 55 * scale;
    const caregiverY = ecoY - 15 * scale;
    const caregiverR = 60 * scale;

    g.append('circle')
      .attr('cx', caregiverX)
      .attr('cy', caregiverY)
      .attr('r', caregiverR)
      .attr('fill', 'rgba(130, 224, 170, 0.7)')
      .attr('stroke', '#27ae60')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event) {
        d3.select(this).style('filter', 'url(#glow)');
        setTooltip({
          label: 'Caregiver',
          description:
            'Human operators who interact with and guide the robotic systems',
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).style('filter', 'none');
        setTooltip(null);
      });

    g.append('text')
      .attr('x', caregiverX - 18 * scale)
      .attr('y', caregiverY + 4 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e8449')
      .attr('font-size', `${12 * scale}px`)
      .attr('font-weight', '600')
      .style('pointer-events', 'none')
      .text('Caregiver');

    // ROBOTS circle (right in ecosystem - connects to zoom)
    const robotsX = ecoX + 55 * scale;
    const robotsY = ecoY - 15 * scale;
    const robotsR = 60 * scale;

    g.append('circle')
      .attr('cx', robotsX)
      .attr('cy', robotsY)
      .attr('r', robotsR)
      .attr('fill', 'rgba(93, 173, 226, 0.75)')
      .attr('stroke', '#2980b9')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event) {
        d3.select(this).style('filter', 'url(#glow)');
        setTooltip({
          label: 'Robots',
          description:
            'Autonomous systems - see zoom callout for internal design',
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).style('filter', 'none');
        setTooltip(null);
      })
      .on('click', () => onAreaClick?.('intelligent-driving'));

    g.append('text')
      .attr('x', robotsX + 18 * scale)
      .attr('y', robotsY + 4 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1a5276')
      .attr('font-size', `${13 * scale}px`)
      .attr('font-weight', '600')
      .style('pointer-events', 'none')
      .text('Robots');

    // CARE RECIPIENT circle (bottom center in ecosystem)
    const recipientX = ecoX;
    const recipientY = ecoY + 50 * scale;
    const recipientR = 55 * scale;

    g.append('circle')
      .attr('cx', recipientX)
      .attr('cy', recipientY)
      .attr('r', recipientR)
      .attr('fill', 'rgba(235, 152, 78, 0.7)')
      .attr('stroke', '#e67e22')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event) {
        d3.select(this).style('filter', 'url(#glow)');
        setTooltip({
          label: 'Care Recipient',
          description:
            'End users who benefit from the human-robot collaboration',
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).style('filter', 'none');
        setTooltip(null);
      })
      .on('click', () => onAreaClick?.('assistive-robotics'));

    g.append('text')
      .attr('x', recipientX)
      .attr('y', recipientY - 5 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#784212')
      .attr('font-size', `${11 * scale}px`)
      .attr('font-weight', '600')
      .style('pointer-events', 'none')
      .text('Care');

    g.append('text')
      .attr('x', recipientX)
      .attr('y', recipientY + 10 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#784212')
      .attr('font-size', `${11 * scale}px`)
      .attr('font-weight', '600')
      .style('pointer-events', 'none')
      .text('Recipient');

    // ===== ZOOM CONNECTOR LINE =====

    // Dashed curved line from Robots to Zoom callout
    const lineStart = {
      x: robotsX + robotsR * 0.7,
      y: robotsY - robotsR * 0.5,
    };
    const lineEnd = {
      x: zoomX - zoomRadius - 10 * scale,
      y: zoomY - zoomRadius * 0.3,
    };

    g.append('path')
      .attr(
        'd',
        `M ${lineStart.x} ${lineStart.y} 
         Q ${(lineStart.x + lineEnd.x) / 2} ${lineStart.y - 40 * scale}
         ${lineEnd.x} ${lineEnd.y}`,
      )
      .attr('fill', 'none')
      .attr('stroke', '#5dade2')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,4')
      .attr('opacity', 0.7);

    // Small circles at connection points
    g.append('circle')
      .attr('cx', lineStart.x)
      .attr('cy', lineStart.y)
      .attr('r', 4)
      .attr('fill', '#5dade2');

    // ===== ZOOM CALLOUT (RIGHT SIDE) =====

    // Outer ring for zoom callout
    g.append('circle')
      .attr('cx', zoomX)
      .attr('cy', zoomY)
      .attr('r', zoomRadius + 8 * scale)
      .attr('fill', 'none')
      .attr('stroke', '#5dade2')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.5);

    // Robot circle (zoomed)
    g.append('circle')
      .attr('cx', zoomX)
      .attr('cy', zoomY)
      .attr('r', zoomRadius)
      .attr('fill', 'rgba(93, 173, 226, 0.85)')
      .attr('stroke', '#2980b9')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event) {
        d3.select(this).style('filter', 'url(#glow)');
        setTooltip({
          label: 'Robot (Zoomed)',
          description: 'System capabilities designed around human needs',
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).style('filter', 'none');
        setTooltip(null);
      })
      .on('click', () => onAreaClick?.('intelligent-driving'));

    // Robot label
    g.append('text')
      .attr('x', zoomX)
      .attr('y', zoomY - zoomRadius * 0.55)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', `${20 * scale}px`)
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text('Robot');

    // Human at center of zoomed Robot
    const humanRadius = zoomRadius * 0.42;

    // Pulsing ring
    const pulseRing = g
      .append('circle')
      .attr('cx', zoomX)
      .attr('cy', zoomY)
      .attr('r', humanRadius)
      .attr('fill', 'none')
      .attr('stroke', '#f7dc6f')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    const animatePulse = () => {
      pulseRing
        .transition()
        .duration(2000)
        .attr('r', humanRadius + 12 * scale)
        .attr('opacity', 0)
        .transition()
        .duration(0)
        .attr('r', humanRadius)
        .attr('opacity', 0.6)
        .on('end', animatePulse);
    };
    animatePulse();

    g.append('circle')
      .attr('cx', zoomX)
      .attr('cy', zoomY)
      .attr('r', humanRadius)
      .attr('fill', 'url(#humanGradient)')
      .attr('stroke', '#d4ac0d')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('filter', 'url(#glow)')
      .on('mouseenter', function (event) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', humanRadius * 1.1);
        setTooltip({
          label: 'Human',
          description: 'Central to all design - the focus of human-centered AI',
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(200).attr('r', humanRadius);
        setTooltip(null);
      })
      .on('click', () => onAreaClick?.('assistive-robotics'));

    g.append('text')
      .attr('x', zoomX)
      .attr('y', zoomY + 4 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1a5276')
      .attr('font-size', `${13 * scale}px`)
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text('Human');

    // Zoom label
    g.append('text')
      .attr('x', zoomX)
      .attr('y', zoomY - zoomRadius - 18 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#5dade2')
      .attr('font-size', `${12 * scale}px`)
      .attr('font-style', 'italic')
      .text('Inside Robot Systems');

    // ===== DESCRIPTION LABELS INSIDE PLOT =====
    const descFontSize = 9 * scale;
    const lineHeight = 12 * scale;

    // Helper function to draw multi-line description with leader line
    // Automatically determines vertical anchor based on position
    const drawDescription = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      lines: string[],
      color: string,
      textAnchor: 'start' | 'end' | 'middle' = 'middle',
    ) => {
      // Determine if text is above or below the source point
      const isTextAbove = endY < startY;

      // Calculate text block height for leader line positioning
      const textBlockHeight = (lines.length - 1) * lineHeight;

      // Leader line - connect to the edge of text block closest to source
      const lineEndY = isTextAbove
        ? endY + textBlockHeight + 5 * scale
        : endY - 10 * scale;

      g.append('line')
        .attr('x1', startX)
        .attr('y1', startY)
        .attr('x2', endX)
        .attr('y2', lineEndY)
        .attr('stroke', color)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,2')
        .attr('opacity', 0.5);

      // Small dot at start (on the circle)
      g.append('circle')
        .attr('cx', startX)
        .attr('cy', startY)
        .attr('r', 2)
        .attr('fill', color)
        .attr('opacity', 0.7);

      // Multi-line description text
      const textGroup = g
        .append('text')
        .attr('x', endX)
        .attr('y', endY)
        .attr('text-anchor', textAnchor)
        .attr('fill', color)
        .attr('font-size', `${descFontSize}px`)
        .attr('opacity', 0.85);

      lines.forEach((line, i) => {
        textGroup
          .append('tspan')
          .attr('x', endX)
          .attr('dy', i === 0 ? 0 : lineHeight)
          .text(line);
      });
    };

    // 45-degree angle multiplier (cos(45°) ≈ 0.707)
    const angle45 = 0.707;

    // Caregiver description - line starts at upper-left 45° of circle
    drawDescription(
      caregiverX - caregiverR * angle45,
      caregiverY - caregiverR * angle45,
      ecoX - 150 * scale,
      ecoY - 150 * scale,
      ['Human operators', 'guiding robotic systems'],
      '#82e0aa',
      'middle',
    );

    // Robots description - line starts at upper-right 45° of circle
    drawDescription(
      robotsX + robotsR * angle45,
      robotsY - robotsR * angle45,
      ecoX + 150 * scale,
      ecoY - 150 * scale,
      ['Autonomous systems for', 'collaborative support'],
      '#5dade2',
      'middle',
    );

    // Care Recipient description - line starts at lower-left 45° of circle
    drawDescription(
      recipientX - recipientR * angle45,
      recipientY + recipientR * angle45,
      ecoX,
      height - 50 * scale,
      ['End users benefiting', 'from collaboration'],
      '#eb984e',
      'middle',
    );

    // Human (inside robot) description - line starts at lower-left 45° of Human circle
    drawDescription(
      zoomX - humanRadius * angle45,
      zoomY + humanRadius * angle45,
      zoomX - 100 * scale,
      zoomY + zoomRadius + 50 * scale,
      ['Central to all design', 'Human-centered AI'],
      '#f7dc6f',
      'middle',
    );

    // Robot (zoom view) description - line starts at lower-right 45° of Robot circle
    drawDescription(
      zoomX + zoomRadius * angle45,
      zoomY + zoomRadius * angle45,
      zoomX + 100 * scale,
      zoomY + zoomRadius + 50 * scale,
      ['System designed', 'around human needs'],
      '#5dade2',
      'middle',
    );
  }, [dimensions, onAreaClick]);

  return (
    <div ref={containerRef} className='research-vision-chart w-full'>
      <div className='glass-card p-6 rounded-2xl'>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className='w-full h-auto'
        />
      </div>

      {/* Legend */}
      <div className='flex flex-wrap justify-center gap-5 mt-5 text-sm'>
        <div className='flex items-center gap-2'>
          <div
            className='w-4 h-4 rounded-full'
            style={{ background: '#f5d76e' }}
          />
          <span className='text-white/60'>Environment / Human</span>
        </div>
        <div className='flex items-center gap-2'>
          <div
            className='w-4 h-4 rounded-full'
            style={{ background: '#5dade2' }}
          />
          <span className='text-white/60'>Robots</span>
        </div>
        <div className='flex items-center gap-2'>
          <div
            className='w-4 h-4 rounded-full'
            style={{ background: '#82e0aa' }}
          />
          <span className='text-white/60'>Caregiver</span>
        </div>
        <div className='flex items-center gap-2'>
          <div
            className='w-4 h-4 rounded-full'
            style={{ background: '#eb984e' }}
          />
          <span className='text-white/60'>Care Recipient</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className='fixed z-50 px-4 py-3 rounded-lg shadow-xl pointer-events-none max-w-xs'
          style={{
            left: Math.min(tooltip.x + 15, window.innerWidth - 280),
            top: tooltip.y + 15,
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className='font-bold text-white mb-1'>{tooltip.label}</div>
          <div className='text-sm text-white/70'>{tooltip.description}</div>
        </div>
      )}
    </div>
  );
};

export default ResearchVisionChart;
