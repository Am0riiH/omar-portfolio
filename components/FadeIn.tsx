'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, ElementType } from 'react';

interface FadeInProps {
  children:   ReactNode;
  delay?:     number;
  className?: string;
  /** Which HTML element to render. Defaults to 'div'. */
  as?:        keyof React.JSX.IntrinsicElements;
}

export default function FadeIn({
  children,
  delay     = 0,
  className = '',
  as        = 'div',
}: FadeInProps) {
  const prefersReduced = useReducedMotion();

  // When the user prefers reduced motion, render a plain semantic element
  // with no animation — respects the OS-level accessibility setting.
  if (prefersReduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  // motion[as] is typed as MotionComponent for every HTML tag, but the
  // index signature isn't exposed publicly. Casting through the object
  // index is safe here because `as` is constrained to JSX.IntrinsicElements.
  const MotionTag = motion[as as keyof typeof motion] as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & {
      initial?: object;
      whileInView?: object;
      viewport?: object;
      transition?: object;
    }
  >;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
