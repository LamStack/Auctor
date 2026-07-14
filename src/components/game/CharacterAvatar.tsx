import { motion } from "framer-motion";

export function CharacterAvatar() {
  return (
    <motion.div
      layoutId="character"
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="animate-float drop-shadow-lg"
      aria-hidden
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#FF7A45" stroke="white" strokeWidth="3" />
        <circle cx="17" cy="21" r="3" fill="white" />
        <circle cx="31" cy="21" r="3" fill="white" />
        <path d="M15 29c3 4 15 4 18 0" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </motion.div>
  );
}
