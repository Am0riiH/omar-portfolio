'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Navigation routes for the application
const ROUTES = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Container variant for staggered text reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  // Item variant: light particles settling into place with subtle bounce
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -15
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 120, // Creates the subtle bounce at the end
      }
    },
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="section flex h-20 items-center justify-between" aria-label="Primary">
        <Link
          href="/"
          className="group font-display text-lg tracking-tight text-ink flex items-center transition-transform duration-300 hover:scale-[1.02] origin-left"
          onClick={() => setOpen(false)}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center"
          >
            <span className="flex font-display">
              {"OMAR HUSSIEN".split('').map((char, i) => (
                <motion.span
                  key={`name-${i}`}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <span className="ml-2 flex items-center text-[0.65rem] font-mono text-muted">
              {"/frontEnd-Dev".split('').map((char, i) => (
                <motion.span
                  key={`role-${i}`}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </motion.div>
        </Link>

        {/* Desktop route list */}
        <ul className="hidden items-center gap-1 md:flex">
          {ROUTES.map((route) => {
            const active = pathname === route.href;
            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="group relative flex items-center gap-2 px-4 py-2 text-sm text-ink transition-colors duration-300 ease-exec"
                >

                  <span>{route.label}</span>
                  {/* underline that "travels" like a packet on hover/active */}
                  <span
                    className={`pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ease-exec ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/contact"
          className="hidden rounded-full border border-ink px-5 py-2 text-sm text-ink transition-colors duration-300 ease-exec hover:bg-ink hover:text-paper md:inline-flex"
        >
          Let&rsquo;s talk
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile route list */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-paper md:hidden"
          >
            {ROUTES.map((route) => (
              <li key={route.href} className="hairline first:border-t-0">
                <Link
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className="section flex items-center gap-3 py-4 text-base text-ink"
                >

                  {route.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
