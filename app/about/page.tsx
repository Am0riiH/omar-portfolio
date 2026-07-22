import type { Metadata } from 'next';
import Eyebrow from '@/components/Eyebrow';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Omar Hussein, a Front-End Developer with a strong foundation in Computer Science, bridging rigorous system architecture with striking UI/UX design.',
  alternates: {
    canonical: 'https://amoridev.com/about',
  },
  openGraph: {
    title: 'About | Omar Hussein',
    description: 'Learn about Omar Hussein, a Front-End Developer with a strong foundation in Computer Science, bridging rigorous system architecture with striking UI/UX design.',
    url: 'https://amoridev.com/about',
  },
};

const PURSUITS = ['React & Tailwind CSS', 'Artificial Intelligence', 'Motion & 3D UI', 'Data Analysis'];

export default function AboutPage() {
  return (
    <section className="section py-24 md:py-32">
      <div className="grid gap-16 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>01 / about</Eyebrow>
          <h1 className="text-display-lg font-display">
            Engineering Logic.
            <br />
            Crafting Experiences.
          </h1>
        </div>

        <div className="max-w-prose space-y-6 text-lg leading-relaxed text-muted">
          <p>
            I&apos;m a Front-End Developer with a foundation rooted in{' '}
            <span className="text-ink dark:text-gray-50">Computer Science and Information Technology</span>
            {' '}— a foundation that isn&apos;t just academic theory, but the engine behind
            every interface I build. I believe the best digital products live at the exact
            intersection of rigorous system architecture and striking, human-centric design.
          </p>
          <p>
            I don&apos;t just write code — I engineer{' '}
            <span className="text-ink dark:text-gray-50">resilient, highly optimized, and scalable front-end solutions</span>,
            while obsessing over pixel-perfect UI/UX implementation. From crafting modular,
            state-driven components to orchestrating smooth animations and interactive elements,
            my methodology is always performance-first, treating speed, accessibility, and
            precision as non-negotiable requirements.
          </p>
          <p>
            My technical curiosity constantly pushes me beyond the core stack,
            experimenting with:
          </p>
          <ul className="grid grid-cols-2 gap-3 pt-2">
            {PURSUITS.map((p) => (
              <li
                key={p}
                className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink dark:text-gray-50 dark:bg-neutral-900 dark:border-neutral-800"
              >
                {p}
              </li>
            ))}
          </ul>
          <p>
            The result: a developer who brings the analytical mindset of a computer
            scientist and the creative execution of a front-end specialist to every
            project — translating complex logic into flawless, intuitive user experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
