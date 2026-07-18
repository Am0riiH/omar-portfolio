import type { Metadata } from 'next';
import Eyebrow from '@/components/Eyebrow';

export const metadata: Metadata = { title: 'Certifications' };

const CERTS = [
  {
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta · via Coursera',
    note: 'Comprehensive program covering React, JavaScript, HTML/CSS, UI/UX principles, and version control.',
  },
  {
    title: 'JavaScript Professional Certificate',
    issuer: 'Meta · via Coursera',
    note: 'Second professional certification reinforcing production front-end practices and component architecture.',
  },
   {
    title: 'DevOps Professional Certificate',
    issuer: 'IBM · via Coursera',
    note: 'Comprehensive program covering DevOps principles, tools, and practices.',
  },
];

export default function CertificationsPage() {
  return (
    <section className="section py-24 md:py-32">
      <Eyebrow>03 / certifications</Eyebrow>
      <h1 className="text-display-lg font-display max-w-2xl">
        Verified, not just claimed.
      </h1>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {CERTS.map((cert, i) => (
          <article
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-line dark:border-neutral-800 bg-surface dark:bg-neutral-900 p-8 transition-colors duration-300 hover:border-accent"
          >
            <div>
              <span className="font-mono text-xs text-muted dark:text-gray-400">
                CERT {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-3 font-display text-xl leading-snug text-ink dark:text-gray-50">{cert.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted dark:text-gray-400">{cert.note}</p>
            </div>
            <p className="mt-8 text-sm text-ink dark:text-gray-50">{cert.issuer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
