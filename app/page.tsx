import Link from 'next/link';
import dynamic from 'next/dynamic';
import Eyebrow from '@/components/Eyebrow';

// The route diagram is purely decorative and never affects layout (it has
// a reserved max-width), so it is safe to defer off the critical path —
// the hero's text and CTA paint first, this streams in just after.
const RoutePath = dynamic(() => import('@/components/RoutePath'), {
  ssr: false,
  loading: () => <div className="h-[260px] w-full max-w-md" aria-hidden="true" />,
});

const CAPABILITIES = [
  { label: 'Interfaces', detail: 'Built with React, semantic HTML, and CSS Grid — no shortcuts, no div soup.' },
  { label: 'Data', detail: 'Applications backed by structured, SQL-driven data — nothing improvised, nothing guessed.' },
  { label: 'Motion', detail: 'Framer Motion, physics-based transitions, and micro-interactions — nothing static, nothing accidental.' },
];

export default function HomePage() {
  return (
    <>
      <section className="section pt-20 md:pt-28">
        <div className="grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <Eyebrow live>available for front-end roles</Eyebrow>
            <h1 className="text-display-xl font-display text-ink dark:text-gray-50">
              Interfaces engineered with the same precision as a{' '}
              <span className="italic text-accent">routing table.</span>
            </h1>
            <p className="mt-8 max-w-prose text-lg leading-relaxed text-muted">
              I&apos;m Omar Hussein, a Front-End Developer with a background in Information Technology &amp; 
              Computer Science. I think in systems before I think in pixels — every interface I ship 
              is architected like infrastructure: predictable, fault-tolerant, and built to hold under 
              load.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-all duration-300 ease-exec hover:bg-accent hover:scale-[1.02]"
              >
                View the work
                <span className="transition-transform duration-300 ease-exec group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/about"
                className="text-sm text-ink dark:text-gray-50 underline decoration-line dark:decoration-neutral-700 underline-offset-4 transition-colors hover:decoration-accent"
              >
                More about Omar
              </Link>
            </div>
          </div>

          <div className="hidden justify-self-end md:flex">
            <RoutePath />
          </div>
        </div>
      </section>

      <section className="section mt-28 md:mt-36">
        <div className="hairline border-line dark:border-neutral-800 grid gap-8 pt-10 sm:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.label}>
              <p className="font-display text-xl text-ink dark:text-gray-50">{c.label}</p>
              <p className="mt-2 text-sm text-muted">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
