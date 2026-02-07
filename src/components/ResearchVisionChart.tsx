import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// removed props interface
interface TooltipData {
  label: string;
  description: string;
  x: number;
  y: number;
}

const ResearchVisionChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Responsive sizing
  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = rect.width;
        // Determines if we should switch to vertical layout
        const isMobile = w < 768;

        // Calculate height based on layout
        // Mobile needs more height for vertical stacking
        const h = isMobile
          ? Math.max(600, w * 1.6) // Vertical stack needs more height ratio
          : Math.max(450, w * 0.55); // Desktop aspect ratio

        setDimensions({
          width: w,
          height: h,
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
    const isVertical = width < 768; // Mobile breakpoint

    // Adjust scale - on mobile we want items to be relatively larger to be readable
    // Desktop base: 800x500. Mobile base: ~400x700
    const baseScale = isVertical
      ? Math.min(width / 400, height / 800) * 0.85
      : Math.min(width / 800, height / 500);

    // Enforce reasonable min/max scale
    const scale = Math.max(0.6, Math.min(1.2, baseScale));

    // Positions based on layout
    const ecoX = width * 0.5;
    // On desktop, adjust centers to be side-by-side. On mobile, stack them.
    const ecoCenterX = isVertical ? width * 0.5 : width * 0.35;
    const ecoCenterY = isVertical ? height * 0.25 : height * 0.5;

    const zoomCenterX = isVertical ? width * 0.5 : width * 0.72;
    const zoomCenterY = isVertical ? height * 0.72 : height * 0.5;

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

    // ===== ECOSYSTEM (LEFT/TOP SIDE) =====

    // Environment outer ellipse
    g.append('ellipse')
      .attr('cx', ecoCenterX)
      .attr('cy', ecoCenterY)
      .attr('rx', 180 * scale)
      .attr('ry', 140 * scale)
      .attr('fill', 'rgba(245, 215, 110, 0.12)')
      .attr('stroke', '#f5d76e')
      .attr('stroke-width', 2);

    // Environment label
    g.append('text')
      .attr('x', ecoCenterX)
      .attr('y', ecoCenterY - 110 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a08050')
      .attr('font-size', `${16 * scale}px`)
      .attr('font-weight', 'bold')
      .text('Environment (Agent)');

    // CAREGIVER circle (left in ecosystem)
    const caregiverX = ecoCenterX - 55 * scale;
    const caregiverY = ecoCenterY - 15 * scale;
    const caregiverR = 60 * scale;

    g.append('circle')
      .attr('cx', caregiverX)
      .attr('cy', caregiverY)
      .attr('r', caregiverR)
      .attr('fill', 'rgba(130, 224, 170, 0.7)')
      .attr('stroke', '#27ae60')
      .attr('stroke-width', 2)
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
    const robotsX = ecoCenterX + 55 * scale;
    const robotsY = ecoCenterY - 15 * scale;
    const robotsR = 60 * scale;

    g.append('circle')
      .attr('cx', robotsX)
      .attr('cy', robotsY)
      .attr('r', robotsR)
      .attr('fill', 'rgba(93, 173, 226, 0.75)')
      .attr('stroke', '#2980b9')
      .attr('stroke-width', 2)
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
      });

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
    const recipientX = ecoCenterX;
    const recipientY = ecoCenterY + 50 * scale;
    const recipientR = 55 * scale;

    g.append('circle')
      .attr('cx', recipientX)
      .attr('cy', recipientY)
      .attr('r', recipientR)
      .attr('fill', 'rgba(235, 152, 78, 0.7)')
      .attr('stroke', '#e67e22')
      .attr('stroke-width', 2)
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
      });

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

    // Calculate connection points based on layout
    let lineStart, lineEnd, controlPoint;

    if (isVertical) {
      // Connect from bottom-right (45 deg) of Robots circle
      // 45 degrees counter-clockwise from bottom (90 deg) -> 45 deg
      const angle = Math.PI / 4;
      lineStart = {
        x: robotsX + robotsR * Math.cos(angle),
        y: robotsY + robotsR * Math.sin(angle),
      };
      lineEnd = {
        x: zoomCenterX,
        y: zoomCenterY - zoomRadius - 10 * scale,
      };
      controlPoint = {
        x: robotsX + robotsR + 20 * scale, // Curve out to the right
        y: (lineStart.y + lineEnd.y) / 2,
      };
    } else {
      // Original side-by-side connection
      lineStart = {
        x: robotsX + robotsR * 0.7,
        y: robotsY - robotsR * 0.5,
      };
      lineEnd = {
        x: zoomCenterX - zoomRadius - 10 * scale,
        y: zoomCenterY - zoomRadius * 0.3,
      };
      controlPoint = {
        x: (lineStart.x + lineEnd.x) / 2,
        y: lineStart.y - 40 * scale,
      };
    }

    g.append('path')
      .attr(
        'd',
        `M ${lineStart.x} ${lineStart.y} 
         Q ${controlPoint.x} ${controlPoint.y}
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

    // ===== ZOOM CALLOUT (RIGHT/BOTTOM SIDE) =====

    // Outer ring for zoom callout
    g.append('circle')
      .attr('cx', zoomCenterX)
      .attr('cy', zoomCenterY)
      .attr('r', zoomRadius + 8 * scale)
      .attr('fill', 'none')
      .attr('stroke', '#5dade2')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.5);

    // Robot circle (zoomed)
    g.append('circle')
      .attr('cx', zoomCenterX)
      .attr('cy', zoomCenterY)
      .attr('r', zoomRadius)
      .attr('fill', 'rgba(93, 173, 226, 0.85)')
      .attr('stroke', '#2980b9')
      .attr('stroke-width', 3)
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
      });

    // Robot label
    g.append('text')
      .attr('x', zoomCenterX)
      .attr('y', zoomCenterY - zoomRadius * 0.55)
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
      .attr('cx', zoomCenterX)
      .attr('cy', zoomCenterY)
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
      .attr('cx', zoomCenterX)
      .attr('cy', zoomCenterY)
      .attr('r', humanRadius)
      .attr('fill', 'url(#humanGradient)')
      .attr('stroke', '#d4ac0d')
      .attr('stroke-width', 2)
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
      });

    g.append('text')
      .attr('x', zoomCenterX)
      .attr('y', zoomCenterY + 4 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1a5276')
      .attr('font-size', `${13 * scale}px`)
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text('Human');

    // Zoom label
    g.append('text')
      .attr('x', zoomCenterX)
      .attr('y', zoomCenterY - zoomRadius - 18 * scale)
      .attr('text-anchor', 'middle')
      .attr('fill', '#5dade2')
      .attr('font-size', `${12 * scale}px`)
      .attr('font-style', 'italic')
      .text('Inside Robot Systems');

    // ===== DESCRIPTION LABELS INSIDE PLOT =====
    // Ensure font size is not too small
    const descFontSize = Math.max(10, 9 * scale);
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

    // Caregiver description
    // On mobile, push text further out or in?
    // Mobile: EcoCenter is width*0.5.
    // Left side: EcoCenter - 130. If width=350, EcoCenter=175. 175-130=45. OK.
    const caregiverDescX = isVertical
      ? ecoCenterX - 130 * scale
      : ecoCenterX - 150 * scale;
    const caregiverDescIconX = caregiverX - caregiverR * angle45;
    const caregiverDescIconY = caregiverY - caregiverR * angle45;

    // Adjust endpoint for mobile to avoid going off-screen
    const caregiverFinalX = isVertical
      ? Math.max(60 * scale, caregiverDescX)
      : caregiverDescX;

    drawDescription(
      caregiverDescIconX,
      caregiverDescIconY,
      caregiverFinalX,
      ecoCenterY - 150 * scale,
      ['Human operators', 'guiding robotic systems'],
      '#82e0aa',
      'middle',
    );

    // Robots description
    const robotsDescX = isVertical
      ? ecoCenterX + 130 * scale
      : ecoCenterX + 150 * scale;
    const robotsDescIconX = robotsX + robotsR * angle45;
    const robotsDescIconY = robotsY - robotsR * angle45;

    // Adjust endpoint for mobile
    const robotsFinalX = isVertical
      ? Math.min(width - 60 * scale, robotsDescX)
      : robotsDescX;

    drawDescription(
      robotsDescIconX,
      robotsDescIconY,
      robotsFinalX,
      ecoCenterY - 150 * scale,
      ['Autonomous systems for', 'collaborative support'],
      '#5dade2',
      'middle',
    );

    // Care Recipient description
    drawDescription(
      recipientX,
      recipientY + recipientR,
      ecoCenterX,
      isVertical ? ecoCenterY + 120 * scale : height - 50 * scale, // Adjust Y for mobile
      ['End users benefiting', 'from collaboration'],
      '#eb984e',
      'middle',
    );

    // Human (inside robot) description
    drawDescription(
      zoomCenterX - humanRadius * angle45,
      zoomCenterY + humanRadius * angle45,
      isVertical ? zoomCenterX - 90 * scale : zoomCenterX - 100 * scale,
      zoomCenterY + zoomRadius + 50 * scale,
      ['Central to all design', 'Human-centered AI'],
      '#f7dc6f',
      'middle',
    );

    // Robot (zoom view) description
    drawDescription(
      zoomCenterX + zoomRadius * angle45,
      zoomCenterY + zoomRadius * angle45,
      isVertical ? zoomCenterX + 90 * scale : zoomCenterX + 100 * scale,
      zoomCenterY + zoomRadius + 50 * scale,
      ['System designed', 'around human needs'],
      '#5dade2',
      'middle',
    );
  }, [dimensions]);

  return (
    <div ref={containerRef} className='research-vision-chart w-full'>
      <div className='glass-card rounded-2xl'>
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
