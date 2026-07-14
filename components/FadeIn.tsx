'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function FadeIn({ children, delay = 0, className = '', as = 'div' }: FadeInProps) {
  const prefersReduced = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as any;

  if (prefersReduced) {
    const Tag = as as any;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
