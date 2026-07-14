'use client';

import { FaCode, FaDatabase, FaLaptopCode, FaBrain, FaCodeBranch } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

const CATEGORY_ICONS: Record<string, IconType> = {
  CP: FaCode,
  DB: FaDatabase,
  FE: FaLaptopCode,
  AF: FaBrain,
  VC: FaCodeBranch,
};

const CATEGORY_LABELS: Record<string, string> = {
  CP: 'Core Programming & Concepts',
  DB: 'Databases & Data Management',
  FE: 'Front-End Development',
  AF: 'Advanced Fields & Emerging Tech',
  VC: 'Version Control & Dev Tools',
};

export default function CategoryIcon({ code }: { code: string }) {
  const Icon = CATEGORY_ICONS[code];
  if (!Icon) return <span className="font-mono text-xs text-accent">{code}</span>;

  return (
    <Icon
      className="h-3.5 w-3.5 text-muted"
      aria-label={CATEGORY_LABELS[code] ?? code}
    />
  );
}
