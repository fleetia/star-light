import type { Point, ColorFormat } from "../utils/colorUtils";

export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  v0: Point,
  v1: Point,
  v2: Point,
  hue: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(v0.x, v0.y);
  ctx.lineTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = "#fff";
  ctx.fill();

  const grad1 = ctx.createLinearGradient(
    v0.x,
    v0.y,
    (v1.x + v2.x) / 2,
    (v1.y + v2.y) / 2
  );
  grad1.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
  grad1.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad1;
  ctx.fill();

  const grad2 = ctx.createLinearGradient(
    v2.x,
    v2.y,
    (v0.x + v1.x) / 2,
    (v0.y + v1.y) / 2
  );
  grad2.addColorStop(0, "rgba(0,0,0,1)");
  grad2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad2;
  ctx.fill();

  ctx.restore();
}

export function drawIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function detectFormat(value: string): ColorFormat {
  if (value.match(/^rgba?\(/)) return "rgba";
  if (value.match(/^hsla?\(/)) return "hsla";
  return "hex";
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}
