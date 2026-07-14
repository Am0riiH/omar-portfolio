'use client';

import type { IconType } from 'react-icons';
import {
  SiC,
  SiCplusplus,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiGit,
  SiGithub,
} from 'react-icons/si';
import {
  FaJava,
  FaCubes,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaPenRuler,
  FaCube,
  FaLink,
  FaChartLine,
  FaBrain,
} from 'react-icons/fa6';

/* ── Icon + brand-color map ────────────────────────── */
export const SKILL_ICONS: Record<string, { icon: IconType; color: string }> = {
  'C & C++':                          { icon: SiCplusplus,   color: '#00599C' },
  'C':                                { icon: SiC,           color: '#A8B9CC' },
  'Java':                             { icon: FaJava,        color: '#ED8B00' },
  'Object-Oriented Programming (OOP)':{ icon: FaCubes,       color: '#8B5CF6' },
  'SQL (Structured Query Language)':  { icon: FaDatabase,    color: '#336791' },
  'Database Management':              { icon: FaDatabase,    color: '#4479A1' },
  'HTML5 & CSS3':                     { icon: FaHtml5,       color: '#E34F26' },
  'JavaScript (ES6+)':               { icon: SiJavascript,  color: '#F7DF1E' },
  'React.js':                         { icon: SiReact,       color: '#61DAFB' },
  'Tailwind CSS':                     { icon: SiTailwindcss, color: '#06B6D4' },
  'UI/UX Implementation':             { icon: FaPenRuler,    color: '#F24E1E' },
  'Motion & 3D Display':              { icon: FaCube,        color: '#A855F7' },
  'AI & Prompt Engineering':          { icon: FaBrain,       color: '#412991' },
  'Data Analysis':                    { icon: FaChartLine,   color: '#10B981' },
  'Git':                              { icon: SiGit,         color: '#F05032' },
  'GitHub':                           { icon: SiGithub,      color: '#FFFFFF' },
};

/* ── Skill badge with icon ─────────────────────────── */
export default function SkillBadge({ name }: { name: string }) {
  const entry = SKILL_ICONS[name];
  const Icon = entry?.icon;

  return (
    <li
      className="group flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-sm text-ink transition-all duration-300 hover:border-accent hover:text-accent hover:scale-[1.05]"
      role="listitem"
    >
      {Icon && (
        <Icon
          className="h-5 w-5 shrink-0 text-muted transition-colors duration-300 group-hover:text-[var(--brand)]"
          aria-hidden="true"
          style={{ '--brand': entry.color } as React.CSSProperties}
        />
      )}
      <span>{name}</span>
    </li>
  );
}
