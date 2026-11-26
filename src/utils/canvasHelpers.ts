import { ThemeMode } from '../types/physics';

export type VectorLineStyle = 'solid' | 'dashed' | 'double' | 'dotted';
export type HatchPattern = 'solid' | 'diagonal' | 'cross' | 'hollow';

export interface CanvasPalette {
  bg: string;
  surface: string;
  ink: string;
  inkInvert: string;
  inkMuted: string;
  gridMajor: string;
  gridMinor: string;
  axis: string;
  fillSoft: string;
  ground: string;
  isDark: boolean;
}

/**
 * Pure Black & White Projector Palette (21:1 foreground/background contrast).
 * light = White Board (#FFFFFF bg, #000000 ink)
 * dark  = Black Board (#000000 bg, #FFFFFF ink)
 */
export function getCanvasPalette(theme: ThemeMode): CanvasPalette {
  if (theme === 'light') {
    return {
      bg: '#FFFFFF',
      surface: '#FFFFFF',
      ink: '#000000',
      inkInvert: '#FFFFFF',
      inkMuted: '#404040',
      gridMajor: 'rgba(0, 0, 0, 0.16)',
      gridMinor: 'rgba(0, 0, 0, 0.06)',
      axis: '#000000',
      fillSoft: '#E5E5E5',
      ground: '#000000',
      isDark: false,
    };
  }
  return {
    bg: '#000000',
    surface: '#000000',
    ink: '#FFFFFF',
    inkInvert: '#000000',
    inkMuted: '#BFBFBF',
    gridMajor: 'rgba(255, 255, 255, 0.22)',
    gridMinor: 'rgba(255, 255, 255, 0.08)',
    axis: '#FFFFFF',
    fillSoft: '#262626',
    ground: '#FFFFFF',
    isDark: true,
  };
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: CanvasPalette,
  step = 44
) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = palette.gridMinor;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step / 2) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y <= h; y += step / 2) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  ctx.strokeStyle = palette.gridMajor;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y <= h; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Extra-bold projector vector arrow using non-color line-style grammar:
 * - 'solid'  (Force F): Thick solid 4px shaft + filled solid arrowhead + inverted solid tag
 * - 'dashed' (Velocity v): Bold dashed 3.2px shaft + hollow outlined arrowhead + bordered tag
 * - 'double' (Momentum / Normal / Angular): Parallel double-line shaft + bold chevron head + double-border tag
 * - 'dotted' (Friction / Gravity / Secondary): Crisp dotted shaft + sharp arrowhead + outlined tag
 */
export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  palette: CanvasPalette,
  label?: string,
  style: VectorLineStyle = 'solid',
  customLineWidth?: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 6) return;

  const angle = Math.atan2(dy, dx);
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const nx = -uy;
  const ny = ux;
  const headLen = Math.min(17, Math.max(10, len * 0.28));
  const headSpread = Math.PI / 5.5;

  ctx.save();
  ctx.strokeStyle = palette.ink;
  ctx.fillStyle = palette.ink;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const shaftEndX = x2 - ux * (headLen * 0.72);
  const shaftEndY = y2 - uy * (headLen * 0.72);

  if (style === 'double') {
    const offset = 3.2;
    ctx.lineWidth = customLineWidth ?? 2.4;
    ctx.beginPath();
    ctx.moveTo(x1 + nx * offset, y1 + ny * offset);
    ctx.lineTo(shaftEndX + nx * offset, shaftEndY + ny * offset);
    ctx.moveTo(x1 - nx * offset, y1 - ny * offset);
    ctx.lineTo(shaftEndX - nx * offset, shaftEndY - ny * offset);
    ctx.stroke();

    // Bold open chevron head for double-line vector
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(x2 - headLen * Math.cos(angle - headSpread), y2 - headLen * Math.sin(angle - headSpread));
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle + headSpread), y2 - headLen * Math.sin(angle + headSpread));
    ctx.stroke();
  } else if (style === 'dashed') {
    ctx.lineWidth = customLineWidth ?? 3.2;
    ctx.setLineDash([9, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Hollow outlined triangle head (distinct from solid Force head)
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - headSpread), y2 - headLen * Math.sin(angle - headSpread));
    ctx.lineTo(x2 - headLen * Math.cos(angle + headSpread), y2 - headLen * Math.sin(angle + headSpread));
    ctx.closePath();
    ctx.fillStyle = palette.bg;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = palette.ink;
    ctx.stroke();
  } else if (style === 'dotted') {
    ctx.lineWidth = customLineWidth ?? 2.8;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - headSpread), y2 - headLen * Math.sin(angle - headSpread));
    ctx.lineTo(x2 - headLen * Math.cos(angle + headSpread), y2 - headLen * Math.sin(angle + headSpread));
    ctx.closePath();
    ctx.fillStyle = palette.ink;
    ctx.fill();
  } else {
    // 'solid' — Force vector: thickest solid shaft + filled triangle head
    ctx.lineWidth = customLineWidth ?? 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - headSpread), y2 - headLen * Math.sin(angle - headSpread));
    ctx.lineTo(x2 - headLen * Math.cos(angle + headSpread), y2 - headLen * Math.sin(angle + headSpread));
    ctx.closePath();
    ctx.fillStyle = palette.ink;
    ctx.fill();
  }

  if (label) {
    ctx.font = '700 13.5px "IBM Plex Mono", monospace';
    const textW = ctx.measureText(label).width;
    const padX = 7;
    const boxH = 22;
    const boxW = textW + padX * 2;
    const rawLx = x2 + ux * 12 - (ux < -0.2 ? boxW : ux < 0.2 ? boxW / 2 : 0);
    const rawLy = y2 + uy * 14 + (Math.abs(uy) < 0.35 ? -18 : uy > 0 ? 4 : -boxH - 2);
    const lx = Math.max(6, Math.min(ctx.canvas.clientWidth - boxW - 6, rawLx));
    const ly = Math.max(6, Math.min(ctx.canvas.clientHeight - boxH - 6, rawLy));

    if (style === 'solid') {
      // Inverted high-contrast solid box for Force
      ctx.fillStyle = palette.ink;
      ctx.beginPath();
      ctx.roundRect(lx, ly, boxW, boxH, 4);
      ctx.fill();
      ctx.fillStyle = palette.inkInvert;
      ctx.fillText(label, lx + padX, ly + 15.5);
    } else {
      // Crisp bordered white/black box for Velocity / Momentum / Dotted
      ctx.fillStyle = palette.bg;
      ctx.beginPath();
      ctx.roundRect(lx, ly, boxW, boxH, 4);
      ctx.fill();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = style === 'double' ? 2.6 : 1.8;
      if (style === 'dashed') ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = palette.ink;
      ctx.fillText(label, lx + padX, ly + 15.5);
    }
  }
  ctx.restore();
}

export function drawSpring(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  coils: number,
  amplitude: number,
  palette: CanvasPalette
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist < 10) return;

  const angle = Math.atan2(dy, dx);
  ctx.save();
  ctx.translate(x1, y1);
  ctx.rotate(angle);
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 3.2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const lead = 16;
  const activeLen = Math.max(10, dist - lead * 2);
  const step = activeLen / (coils * 2);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(lead, 0);
  for (let i = 0; i < coils * 2; i++) {
    const px = lead + (i + 0.5) * step;
    const py = i % 2 === 0 ? -amplitude : amplitude;
    ctx.lineTo(px, py);
  }
  ctx.lineTo(dist - lead, 0);
  ctx.lineTo(dist, 0);
  ctx.stroke();
  ctx.restore();
}

/**
 * Monochrome hatch-patterned rectangle so bars & carts are 100% distinct without color.
 */
export function drawHatchRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pattern: HatchPattern,
  palette: CanvasPalette,
  radius = 4
) {
  if (w <= 0 || h <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();

  if (pattern === 'solid') {
    ctx.fillStyle = palette.ink;
    ctx.fillRect(x, y, w, h);
  } else {
    ctx.fillStyle = palette.bg;
    ctx.fillRect(x, y, w, h);

    if (pattern === 'diagonal' || pattern === 'cross') {
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 2;
      const spacing = 8;
      ctx.beginPath();
      for (let d = -h; d < w + h; d += spacing) {
        ctx.moveTo(x + d, y + h);
        ctx.lineTo(x + d + h, y);
      }
      if (pattern === 'cross') {
        for (let d = -h; d < w + h; d += spacing) {
          ctx.moveTo(x + d, y);
          ctx.lineTo(x + d + h, y + h);
        }
      }
      ctx.stroke();
    }
  }
  ctx.restore();

  // Outer crisp border
  ctx.save();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.stroke();
  ctx.restore();
}

/**
 * Legend item showing the actual monochrome line style (solid / dashed / double / dotted)
 */
export function drawLegendPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  style: VectorLineStyle,
  palette: CanvasPalette
) {
  ctx.save();
  ctx.font = '700 12.5px "IBM Plex Mono", monospace';
  const textW = ctx.measureText(text).width;
  const swatchW = 28;
  const boxW = swatchW + textW + 22;
  const boxH = 26;

  ctx.fillStyle = palette.bg;
  ctx.beginPath();
  ctx.roundRect(x, y, boxW, boxH, 5);
  ctx.fill();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Draw line style swatch
  const sy = y + boxH / 2;
  const sx1 = x + 8;
  const sx2 = sx1 + swatchW;
  ctx.strokeStyle = palette.ink;
  if (style === 'double') {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx1, sy - 2.5);
    ctx.lineTo(sx2, sy - 2.5);
    ctx.moveTo(sx1, sy + 2.5);
    ctx.lineTo(sx2, sy + 2.5);
    ctx.stroke();
  } else {
    ctx.lineWidth = style === 'solid' ? 3.5 : 2.6;
    if (style === 'dashed') ctx.setLineDash([6, 4]);
    else if (style === 'dotted') ctx.setLineDash([2.5, 4]);
    ctx.beginPath();
    ctx.moveTo(sx1, sy);
    ctx.lineTo(sx2, sy);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = palette.ink;
  ctx.fillText(text, sx2 + 8, y + 17.5);
  ctx.restore();
}
