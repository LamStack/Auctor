// Layout for the free-roam candidate world. Positions are fractions (0-1) of
// the world canvas so the same layout works for any track (always 6 stations).

export const WORLD_WIDTH = 1500;
export const WORLD_HEIGHT = 950;
export const TRIGGER_RADIUS = 62;
export const CHARACTER_SPEED = 260; // px/sec

export const SPAWN_POINT = { x: 0.06 * WORLD_WIDTH, y: 0.88 * WORLD_HEIGHT };

const STATION_FRACTIONS = [
  { x: 0.14, y: 0.76 },
  { x: 0.32, y: 0.5 },
  { x: 0.52, y: 0.7 },
  { x: 0.68, y: 0.38 },
  { x: 0.54, y: 0.16 },
  { x: 0.86, y: 0.28 },
];

export function stationWorldPosition(index: number) {
  const frac = STATION_FRACTIONS[index % STATION_FRACTIONS.length];
  return { x: frac.x * WORLD_WIDTH, y: frac.y * WORLD_HEIGHT };
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
