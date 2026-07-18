import type { Metadata } from 'next';
import Eyebrow from '@/components/Eyebrow';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = { title: 'Contact' };

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/Am0riiH', hop: 'github.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/am0rih/', hop: 'linkedin.com' },
  { label: 'Email', href: 'mailto:omar.bin7ussien@gmail.com', hop: 'omar.bin7ussien@gmail.com' },
];

export default function ContactPage() {
  return (
    <section className="section py-24 md:py-32">
      <div className="grid gap-16 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>05 / contact</Eyebrow>
          <h1 className="text-display-lg font-display">Open a connection.</h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
            Have a role, project, or idea in mind? Send a message directly,
            or reach Omar on any of the channels below.
          </p>

          <ul className="mt-10 space-y-4">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex items-center justify-between border-b border-line py-3 text-ink dark:text-gray-50 transition-colors duration-300 hover:border-accent"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent">
                    {link.hop}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
