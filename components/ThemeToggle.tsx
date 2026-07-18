"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // When mounted on client, now we can show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="relative p-2 rounded-md hover:bg-surface dark:hover:bg-neutral-800 transition-colors w-9 h-9" aria-label="Toggle dark mode">
        <span className="sr-only">Toggle dark mode</span>
      </button>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-md hover:bg-surface dark:hover:bg-neutral-800 transition-colors w-9 h-9 flex items-center justify-center text-muted dark:text-gray-300 hover:text-ink dark:hover:text-white"
      aria-label="Toggle dark mode"
    >
      <span className="sr-only">Toggle dark mode</span>
      <AnimatePresence mode="wait" initial={false}>
        {currentTheme === "dark" ? (
          <motion.div
            key="dark"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <HiOutlineSun className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            initial={{ opacity: 0, rotate: 45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -45 }}
            transition={{ duration: 0.2 }}
          >
            <HiOutlineMoon className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
