import type { Metadata } from 'next';
import Eyebrow from '@/components/Eyebrow';
import SkillBadge from '@/components/SkillBadge';
import CategoryIcon from '@/components/CategoryIcon';

export const metadata: Metadata = {
  title: 'Skills & Expertise',
  description: 'Explore Omar Hussein\'s technical expertise across Front-End Development, Core Programming, Databases, and UI/UX design. Proficient in React, Next.js, and more.',
  alternates: {
    canonical: 'https://amoridev.com/skills',
  },
  openGraph: {
    title: 'Skills & Expertise | Omar Hussein',
    description: 'Explore Omar Hussein\'s technical expertise across Front-End Development, Core Programming, Databases, and UI/UX design.',
    url: 'https://amoridev.com/skills',
  },
};

const GROUPS = [
  {
    code: 'CP',
    title: 'Core Programming & Concepts',
    items: [
      'C & C++',
      'Java',
      'Object-Oriented Programming (OOP)',
    ],
  },
  {
    code: 'DB',
    title: 'Databases & Data Management',
    items: [
      'SQL (Structured Query Language)',
      'Database Management',
    ],
  },
  {
    code: 'FE',
    title: 'Front-End Development',
    items: [
      'HTML5 & CSS3',
      'JavaScript (ES6+)',
      'React.js',
      'Tailwind CSS',
      'UI/UX Implementation',
      'Motion & 3D Display',
    ],
  },
  {
    code: 'AF',
    title: 'Advanced Fields & Emerging Tech',
    items: [
      'AI & Prompt Engineering',
      'Data Analysis',
    ],
  },
  {
    code: 'VC',
    title: 'Version Control & Dev Tools',
    items: [
      'Git',
      'GitHub',
    ],
  },
];

export default function SkillsPage() {
  return (
    <section className="section py-24 md:py-32">
      <Eyebrow>02 / skills &amp; expertise</Eyebrow>
      <h1 className="text-display-lg font-display max-w-2xl">
        A stack built for interfaces, backed by systems.
      </h1>

      <div className="mt-16 divide-y divide-line border-t border-line">
        {GROUPS.map((group) => (
          <div key={group.code} className="grid gap-4 py-10 md:grid-cols-[10rem_1fr] md:gap-8">
            <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-1">
              <CategoryIcon code={group.code} />
              <h2 className="font-display text-2xl">{group.title}</h2>
            </div>
            <ul className="flex flex-wrap gap-3">
              {group.items.map((item) => (
                <SkillBadge key={item} name={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
