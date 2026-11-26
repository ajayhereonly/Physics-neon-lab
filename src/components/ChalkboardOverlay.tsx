import React, { useEffect, useRef } from 'react';
import { ChalkStroke, ChalkTone, DrawingTool, ThemeMode } from '../types/physics';

interface ChalkboardOverlayProps {
  active: boolean;
  tool: DrawingTool;
  tone: ChalkTone;
  theme: ThemeMode;
  strokes: ChalkStroke[];
  onAddStroke: (stroke: ChalkStroke) => void;
}

function resolveMonochromeInk(tone: ChalkTone, theme: ThemeMode): string {
  if (theme === 'dark') {
    if (tone === 'muted') return '#A3A3A3';
    return '#FFFFFF';
  }
  if (tone === 'muted') return '#525252';
  return '#000000';
}

export function ChalkboardOverlay({
  active,
  tool,
  tone,
  theme,
  strokes,
  onAddStroke,
}: ChalkboardOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStrokeRef = useRef<ChalkStroke | null>(null);

  const renderStrokes = (preview?: ChalkStroke | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const list = preview ? [...strokes, preview] : strokes;
    for (const s of list) {
      if (s.points.length === 0) continue;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const inkColor = resolveMonochromeInk(s.tone, theme);

      if (s.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 26;
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else if (s.tool === 'highlighter') {
        ctx.globalAlpha = 0.24;
        ctx.lineWidth = 20;
        ctx.strokeStyle = inkColor;
      } else {
        ctx.globalAlpha = 1;
        ctx.lineWidth = s.width;
        ctx.strokeStyle = inkColor;
      }

      if ((s.tool === 'arrow' || s.tool === 'dashed-arrow') && s.points.length >= 2) {
        const start = s.points[0];
        const end = s.points[s.points.length - 1];
        const sx = start.x * rect.width;
        const sy = start.y * rect.height;
        const ex = end.x * rect.width;
        const ey = end.y * rect.height;
        const ang = Math.atan2(ey - sy, ex - sx);
        const head = 16;

        if (s.tool === 'dashed-arrow') {
          ctx.setLineDash([9, 6]);
        }
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - head * Math.cos(ang - Math.PI / 6), ey - head * Math.sin(ang - Math.PI / 6));
        ctx.lineTo(ex - head * Math.cos(ang + Math.PI / 6), ey - head * Math.sin(ang + Math.PI / 6));
        ctx.closePath();

        if (s.tool === 'dashed-arrow') {
          ctx.fillStyle = theme === 'dark' ? '#000000' : '#FFFFFF';
          ctx.fill();
          ctx.lineWidth = 2.6;
          ctx.stroke();
        } else {
          ctx.fillStyle = inkColor;
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        s.points.forEach((pt, idx) => {
          const px = pt.x * rect.width;
          const py = pt.y * rect.height;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  };

  useEffect(() => {
    renderStrokes(null);
    const onResize = () => renderStrokes(currentStrokeRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [strokes, theme]);

  const getNormalizedPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getNormalizedPoint(e);
    currentStrokeRef.current = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      tool,
      tone,
      width: tone === 'bold' ? 6 : tool === 'arrow' || tool === 'dashed-arrow' ? 3.8 : 3.5,
      points: [pt],
    };
    renderStrokes(currentStrokeRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || !currentStrokeRef.current) return;
    const pt = getNormalizedPoint(e);
    if (currentStrokeRef.current.tool === 'arrow' || currentStrokeRef.current.tool === 'dashed-arrow') {
      currentStrokeRef.current.points = [currentStrokeRef.current.points[0], pt];
    } else {
      currentStrokeRef.current.points.push(pt);
    }
    renderStrokes(currentStrokeRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || !currentStrokeRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const finished = currentStrokeRef.current;
    currentStrokeRef.current = null;
    if (finished.points.length >= 1) {
      onAddStroke(finished);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute inset-0 w-full h-full touch-none ${
        active ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
      aria-label="Monochrome classroom chalkboard drawing overlay"
    />
  );
}
