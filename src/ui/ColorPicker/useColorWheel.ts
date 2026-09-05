import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  type HSLA,
  type ColorFormat,
  type Point,
  parseColor,
  formatColor,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  hexToRgb,
  cartesianToAngle,
  polarToCartesian,
  getTriangleVertices,
  slToTrianglePoint,
  trianglePointToSL,
  clampToTriangle
} from "../utils/colorUtils";

import {
  WHEEL_SIZE,
  RING_WIDTH,
  INNER_RADIUS,
  TRIANGLE_RADIUS
} from "./ColorPicker.constants";
import {
  drawTriangle,
  drawIndicator,
  detectFormat,
  clamp
} from "./ColorPicker.utils";
import type { DragTarget } from "./ColorPicker.type";

const CX = WHEEL_SIZE / 2;
const CY = WHEEL_SIZE / 2;

export function useColorWheel(
  value: string,
  onChange: (color: string) => void,
  showAlpha: boolean
) {
  const [hsla, setHsla] = useState<HSLA>(() => parseColor(value));
  const [format, setFormat] = useState<ColorFormat>(() => detectFormat(value));

  const dragTarget = useRef<DragTarget>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueWheelCache = useRef<ImageData | null>(null);
  const prevValueRef = useRef(value);
  const alphaTrackRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      const parsed = parseColor(value);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing external prop to internal state
      setHsla(parsed);
    }
  }, [value]);

  const emit = useCallback(
    (next: HSLA) => {
      const fmt =
        showAlpha && next.a < 1 ? (format === "hex" ? "rgba" : format) : format;
      const str = formatColor(next, fmt);
      prevValueRef.current = str;
      onChange(str);
    },
    [format, onChange, showAlpha]
  );

  // --- Canvas rendering ---
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = WHEEL_SIZE;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    // Hue ring (cache)
    if (
      !hueWheelCache.current ||
      hueWheelCache.current.width !== canvas.width
    ) {
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const octx = offscreen.getContext("2d");
      if (!octx) return;
      octx.scale(dpr, dpr);
      const outerR = size / 2;
      const cg = octx.createConicGradient(-Math.PI / 2, CX, CY);
      for (let i = 0; i <= 360; i += 1) {
        cg.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
      }
      octx.beginPath();
      octx.arc(CX, CY, outerR, 0, Math.PI * 2);
      octx.arc(CX, CY, INNER_RADIUS, 0, Math.PI * 2, true);
      octx.fillStyle = cg;
      octx.fill();
      hueWheelCache.current = octx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
    ctx.putImageData(hueWheelCache.current, 0, 0);

    // Triangle
    const [v0, v1, v2] = getTriangleVertices(CX, CY, TRIANGLE_RADIUS, 0);
    drawTriangle(ctx, v0, v1, v2, hsla.h);

    // Hue indicator
    const hueAngle = hsla.h - 90;
    const hueR = INNER_RADIUS + RING_WIDTH / 2;
    const hp = polarToCartesian(CX, CY, hueR, hueAngle);
    drawIndicator(ctx, hp.x, hp.y, 7, `hsl(${hsla.h}, 100%, 50%)`);

    // SL indicator
    const slPt = slToTrianglePoint(hsla.s, hsla.l, v0, v1, v2);
    const [ir, ig, ib] = hslToRgb(hsla.h, hsla.s, hsla.l);
    drawIndicator(ctx, slPt.x, slPt.y, 6, rgbToHex(ir, ig, ib));
  }, [hsla.h, hsla.s, hsla.l]);

  // --- Drag helpers ---
  const getCanvasPos = (e: React.PointerEvent | PointerEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = WHEEL_SIZE / rect.width;
    const scaleY = WHEEL_SIZE / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const updateHue = useCallback(
    (p: Point) => {
      const angle = cartesianToAngle(p.x - CX, p.y - CY);
      const h = Math.round((angle + 90) % 360);
      setHsla(prev => {
        const next = { ...prev, h };
        queueMicrotask(() => emit(next));
        return next;
      });
    },
    [emit]
  );

  const updateTriangle = useCallback(
    (p: Point) => {
      setHsla(prev => {
        const [v0, v1, v2] = getTriangleVertices(CX, CY, TRIANGLE_RADIUS, 0);
        const clamped = clampToTriangle(p, v0, v1, v2);
        const { s, l } = trianglePointToSL(clamped, v0, v1, v2);
        const next = { ...prev, s, l };
        queueMicrotask(() => emit(next));
        return next;
      });
    },
    [emit]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = getCanvasPos(e);
    const dx = p.x - CX,
      dy = p.y - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= INNER_RADIUS && dist <= WHEEL_SIZE / 2) {
      dragTarget.current = "hue";
      updateHue(p);
    } else if (dist < INNER_RADIUS) {
      dragTarget.current = "triangle";
      updateTriangle(p);
    }
    canvasRef.current!.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragTarget.current) return;
    const p = getCanvasPos(e);
    if (dragTarget.current === "hue") updateHue(p);
    else if (dragTarget.current === "triangle") updateTriangle(p);
  };

  const handlePointerUp = () => {
    dragTarget.current = null;
  };

  // --- Alpha slider ---
  const updateAlphaFromEvent = (e: React.PointerEvent | PointerEvent) => {
    const track = alphaTrackRef.current!;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const a = Math.round(ratio * 100) / 100;
    setHsla(prev => {
      const next = { ...prev, a };
      queueMicrotask(() => emit(next));
      return next;
    });
  };

  const handleAlphaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragTarget.current = "alpha";
    alphaTrackRef.current!.setPointerCapture(e.pointerId);
    updateAlphaFromEvent(e);
  };

  const handleAlphaPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragTarget.current !== "alpha") return;
    updateAlphaFromEvent(e);
  };

  // --- Format input ---
  const handleFieldChange = (field: string, raw: string) => {
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    let next = { ...hsla };

    if (format === "hsla") {
      if (field === "h") next.h = clamp(val, 0, 360);
      else if (field === "s") next.s = clamp(val, 0, 100);
      else if (field === "l") next.l = clamp(val, 0, 100);
      else if (field === "a") next.a = clamp(val, 0, 1);
    } else if (format === "rgba") {
      const [r, g, b] = hslToRgb(next.h, next.s, next.l);
      let nr = r,
        ng = g,
        nb = b;
      if (field === "r") nr = clamp(val, 0, 255);
      else if (field === "g") ng = clamp(val, 0, 255);
      else if (field === "b") nb = clamp(val, 0, 255);
      else if (field === "a") {
        next.a = clamp(val, 0, 1);
        setHsla(next);
        emit(next);
        return;
      }
      const [h, s, l] = rgbToHsl(nr, ng, nb);
      // preserve hue when achromatic
      next = { h: s === 0 ? next.h : h, s, l, a: next.a };
    }
    setHsla(next);
    emit(next);
  };

  const handleHexInput = (raw: string) => {
    const cleaned = raw.startsWith("#") ? raw : `#${raw}`;
    if (!/^#[0-9a-fA-F]{6}$/.test(cleaned)) return;
    const [r, g, b] = hexToRgb(cleaned);
    const [h, s, l] = rgbToHsl(r, g, b);
    const next = { h: s === 0 ? hsla.h : h, s, l, a: hsla.a };
    setHsla(next);
    emit(next);
  };

  // --- Display ---
  const displayValue = formatColor(
    hsla,
    showAlpha ? (format === "hex" ? "rgba" : format) : format
  );

  const swatchColor = useMemo(() => {
    const [r, g, b] = hslToRgb(hsla.h, hsla.s, hsla.l);
    return `rgba(${r}, ${g}, ${b}, ${hsla.a})`;
  }, [hsla.h, hsla.s, hsla.l, hsla.a]);

  return {
    hsla,
    format,
    setFormat,
    displayValue,
    swatchColor,
    canvasRef,
    alphaTrackRef,
    drawWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleAlphaPointerDown,
    handleAlphaPointerMove,
    handleFieldChange,
    handleHexInput
  };
}
