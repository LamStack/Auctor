"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useAnimationFrame } from "framer-motion";
import { CHARACTER_SPEED, TRIGGER_RADIUS, WORLD_HEIGHT, WORLD_WIDTH, clamp, distance } from "@/lib/gameWorld";

export interface WorldStation {
  id: string;
  x: number;
  y: number;
  interactive: boolean; // only the current (next unanswered) station triggers on arrival
}

const MOVE_KEYS: Record<string, { dx: number; dy: number }> = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
  w: { dx: 0, dy: -1 },
  s: { dx: 0, dy: 1 },
  a: { dx: -1, dy: 0 },
  d: { dx: 1, dy: 0 },
};

export function useCharacterController({
  spawn,
  stations,
  paused,
  onArrive,
}: {
  spawn: { x: number; y: number };
  stations: WorldStation[];
  paused: boolean;
  onArrive: (stationId: string) => void;
}) {
  const x = useMotionValue(spawn.x);
  const y = useMotionValue(spawn.y);
  const [walking, setWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);

  const pressedKeys = useRef<Set<string>>(new Set());
  const target = useRef<{ x: number; y: number } | null>(null);
  const walkingRef = useRef(false);
  const facingRef = useRef(false);
  const arrivedStationRef = useRef<string | null>(null);
  const stationsRef = useRef(stations);
  stationsRef.current = stations;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (MOVE_KEYS[e.key]) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
        target.current = null;
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      pressedKeys.current.delete(e.key);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function moveTo(point: { x: number; y: number }) {
    pressedKeys.current.clear();
    target.current = point;
  }

  useAnimationFrame((_time, delta) => {
    if (paused) return;
    const dt = Math.min(delta, 48) / 1000;

    let dx = 0;
    let dy = 0;

    for (const key of pressedKeys.current) {
      const dir = MOVE_KEYS[key];
      if (dir) {
        dx += dir.dx;
        dy += dir.dy;
      }
    }

    let isMoving = dx !== 0 || dy !== 0;

    if (!isMoving && target.current) {
      const cx = x.get();
      const cy = y.get();
      const tx = target.current.x;
      const ty = target.current.y;
      const dist = distance({ x: cx, y: cy }, { x: tx, y: ty });
      if (dist < 4) {
        target.current = null;
      } else {
        dx = (tx - cx) / dist;
        dy = (ty - cy) / dist;
        isMoving = true;
      }
    }

    if (isMoving) {
      const length = Math.hypot(dx, dy) || 1;
      const nx = x.get() + (dx / length) * CHARACTER_SPEED * dt;
      const ny = y.get() + (dy / length) * CHARACTER_SPEED * dt;
      x.set(clamp(nx, 20, WORLD_WIDTH - 20));
      y.set(clamp(ny, 20, WORLD_HEIGHT - 20));

      if (dx < -0.1 && !facingRef.current) {
        facingRef.current = true;
        setFacingLeft(true);
      } else if (dx > 0.1 && facingRef.current) {
        facingRef.current = false;
        setFacingLeft(false);
      }
    }

    if (isMoving !== walkingRef.current) {
      walkingRef.current = isMoving;
      setWalking(isMoving);
    }

    const pos = { x: x.get(), y: y.get() };
    const nearby = stationsRef.current.find((s) => s.interactive && distance(pos, s) < TRIGGER_RADIUS);
    if (nearby && arrivedStationRef.current !== nearby.id) {
      arrivedStationRef.current = nearby.id;
      target.current = null;
      onArrive(nearby.id);
    } else if (!nearby) {
      arrivedStationRef.current = null;
    }
  });

  return { x, y, walking, facingLeft, moveTo };
}
