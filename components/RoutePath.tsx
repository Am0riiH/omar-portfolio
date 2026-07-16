'use client';

import { motion, useReducedMotion } from 'framer-motion';

// The hero's signature element: a hand-crafted </> terminal cursor symbol.
// The brackets stay static; only the thin vertical cursor line blinks —
// evoking a live code editor, calm and precise.
export default function RoutePath() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="flex h-auto w-full max-w-[220px] items-end justify-start sm:max-w-[280px] md:max-w-md"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <svg
        viewBox="0 0 200 120"
        className="h-auto w-full"
        fill="none"
        role="img"
        aria-label="Coding terminal symbol"
      >
        {/* < bracket */}
        <motion.polyline
          points="60,20 25,60 60,100"
          stroke="#2F5CFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        />

        {/* / slash */}
        <motion.line
          x1="110"
          y1="15"
          x2="90"
          y2="105"
          stroke="#2F5CFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.65 }}
        />

        {/* > bracket */}
        <motion.polyline
          points="140,20 175,60 140,100"
          stroke="#2F5CFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
        />

        {/* Blinking terminal cursor */}
        <motion.line
          x1="188"
          y1="38"
          x2="188"
          y2="82"
          stroke="#2F5CFF"
          strokeWidth="3"
          strokeLinecap="round"
          animate={
            prefersReduced
              ? { opacity: 1 }
              : { opacity: [1, 0, 1] }
          }
          transition={
            prefersReduced
              ? {}
              : {
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 0,
                  delay: 1.4,
                }
          }
        />
      </svg>
    </motion.div>
  );
}
