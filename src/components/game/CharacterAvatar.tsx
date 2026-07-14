"use client";

import { motion, MotionValue } from "framer-motion";

export function CharacterAvatar({
  x,
  y,
  walking,
  facingLeft,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  walking: boolean;
  facingLeft: boolean;
}) {
  return (
    <motion.div
      style={{ x, y, translateX: "-50%", translateY: "-100%" }}
      className="pointer-events-none absolute left-0 top-0 z-10 drop-shadow-lg"
    >
      <motion.div
        animate={walking ? { y: [0, -5, 0] } : { y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: walking ? 0.35 : 1.8, ease: "easeInOut" }}
        style={{ scaleX: facingLeft ? -1 : 1 }}
      >
        <svg width="46" height="58" viewBox="0 0 46 58" fill="none">
          {/* shadow */}
          <ellipse cx="23" cy="54" rx="14" ry="4" fill="black" fillOpacity="0.18" />
          {/* legs */}
          <motion.rect
            x="14"
            y="38"
            width="7"
            height="16"
            rx="3"
            fill="#2C2494"
            animate={walking ? { y: [38, 34, 38], height: [16, 20, 16] } : {}}
            transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
          />
          <motion.rect
            x="25"
            y="38"
            width="7"
            height="16"
            rx="3"
            fill="#2C2494"
            animate={walking ? { y: [42, 38, 42], height: [12, 16, 12] } : {}}
            transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut", delay: 0.17 }}
          />
          {/* body */}
          <rect x="10" y="18" width="26" height="24" rx="10" fill="#FF7A45" stroke="white" strokeWidth="2.5" />
          {/* head */}
          <circle cx="23" cy="14" r="13" fill="#FF7A45" stroke="white" strokeWidth="2.5" />
          <circle cx="18" cy="13" r="2.4" fill="white" />
          <circle cx="28" cy="13" r="2.4" fill="white" />
          <path d="M17 19c2.5 3 9.5 3 12 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
