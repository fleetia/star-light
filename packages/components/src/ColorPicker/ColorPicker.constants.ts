export const WHEEL_SIZE = 220;
export const RING_WIDTH = 22;
export const INNER_RADIUS = WHEEL_SIZE / 2 - RING_WIDTH;
export const TRIANGLE_RADIUS = INNER_RADIUS - 4;

export const isTouchDevice =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;
