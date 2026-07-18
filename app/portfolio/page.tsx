import type { Metadata } from 'next';
import Eyebrow from '@/components/Eyebrow';

export const metadata: Metadata = { title: 'Portfolio & Experience' };

const PROJECTS = [
  {
    title: 'Sneaker Concept Store (E-Commerce)',
    year: 2026,
    type: 'Dynamic E-Commerce Application',
    status: 'In Development',
    overview:
      'A highly interactive, performance-driven e-commerce storefront concept. This project pushes the boundaries of modern Front-End capabilities, focusing heavily on dynamic product displays, fluid motion design, and an immersive user experience designed to drive high conversion rates.',
    features: [
      'Immersive Motion Design: Implementing fluid state transitions, dynamic product scaling on hover, and smooth entrance animations.',
      'Complex State Management: Structuring robust logic for shopping cart operations, dynamic product variant selections (size/color), and instant UI feedback.',
      'Interactive Product Showcases: High-impact visual displays with interactive elements that respond to user interactions instantly.',
    ],
    stack: [
      'React',
      'Tailwind CSS',
      'Framer Motion',
      'React Hooks',
    ],
  },
  {
    title: 'Front-End Assistant Intern',
    year: 2026,
    type: 'Professional Internship',
    status: 'Completed',
    overview:
      'A two-month intensive software development internship within the software development department at Alam Al-Sadara Al-Raqmiya (Digital Leadership World). Worked as a Front-End assistant, focusing on building structured, responsive layouts and collaborating with a professional development team to significantly enhance production-level coding standards.',
    features: [
      'Structured Layouts: Engineered responsive, high-fidelity UI components ensuring cross-device compatibility.',
      'Database Integration: Handled SQL queries and integrated back-end data seamlessly into the front-end interfaces.',
      'Team Collaboration: Functioned within a professional software development department, utilizing industry-standard workflows.',
    ],
    stack: [
      'React',
      'SQL',
      'HTML5/CSS3',
      'Tailwind CSS',
    ],
  },
  {
    title: 'Al-Waha Corporate Website',
    year: 2025,
    type: 'B2B Corporate Platform',
    status: 'Completed',
    overview:
      'A fully bilingual (Arabic/English) professional corporate website developed for "Al-Waha Leading Company for Foodstuff and Livestock Import". The project focused strictly on an "Executive" and "Modern Minimalist" design language, delivering a high-end, trustworthy digital presence for a major commercial entity.',
    features: [
      'Bilingual Architecture: Seamless LTR/RTL layout switching and precise content localization without UI breakage.',
      'Executive UI/UX: A clean, distraction-free interface utilizing premium typography, strategic whitespace, and subtle micro-interactions to reflect corporate authority.',
      'Robust Architecture: Complex layout structuring using CSS Grid to present extensive corporate data elegantly across all devices.',
    ],
    stack: [
      'React',
      'Tailwind CSS',
      'i18n',
      'CSS Grid',
      'Framer Motion',
    ],
  },
  {
    title: 'Premium Hotel Booking Interface',
    year: 2025,
    type: 'Hospitality / UI Architecture',
    status: 'Completed',
    overview:
      'A luxurious and minimalist web application interface designed for the premium hospitality sector. This project was built by cleverly refactoring and adapting the highly modular components developed during the Al-Waha project. The strict design constraint was to eliminate traditional UI icons, relying entirely on superior typography, pure geometry, and perfect spacing to convey elegance.',
    features: [
      'Typography-Driven Design: Completely icon-less UI that relies on strong typographical hierarchies and pristine spatial alignment (Padding/Margin precision).',
      'Advanced Component Reusability: Successfully decoupled core structural components from a corporate context and restyled them for a high-end booking experience.',
      'Clean DOM Structure: Highly optimized rendering performance due to the intentional omission of external SVG/icon libraries.',
    ],
    stack: [
      'React',
      'Tailwind CSS',
      'Context API',
      'Flexbox/Grid layouts',
    ],
  },
  {
    title: 'Interactive Portfolio Architecture (Client Project)',
    year: 2024,
    type: 'Personal Branding / Interactive Web Presence',
    status: 'Completed',
    overview:
      'A bespoke, highly interactive personal portfolio designed and developed for a client to showcase their professional work. Engineered for maximum performance, scalability, and type safety, this project emphasizes complex spatial motion. The UI highlights a sophisticated layout featuring dynamic, animated elements (such as a fluid floating box) that interact seamlessly within the viewport, creating an engaging and modern visual experience.',
    features: [
      'Enterprise-Grade Architecture: Built with Next.js for superior server-side rendering (SSR) capabilities and performance optimization.',
      'Type-Safe Engineering: Implemented TypeScript to ensure high code reliability, maintainability, and fewer runtime errors.',
      'Spatial Motion Design: Developed fluid, physics-based animations (specifically dynamic floating elements) that interact intelligently within their containers without sacrificing performance.',
    ],
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'JavaScript',
      'HTML5/CSS3',
      'Framer Motion',
    ],
  },
];

export default function PortfolioPage() {
  return (
    <section className="section py-24 md:py-32">
      <Eyebrow>04 / portfolio &amp; experience</Eyebrow>
      <h1 className="text-display-lg font-display max-w-2xl">
        Work built for real teams and real users.
      </h1>


      {/* Projects */}
      <div className="mt-20">
        <h2 className="eyebrow mb-6">selected projects</h2>
        <div className="flex flex-col gap-16">
          {PROJECTS.map((project, idx) => (
            <article
              key={project.title}
              className="hairline grid gap-6 pt-8 md:grid-cols-[10rem_1fr]"
            >
              <div className="flex flex-col gap-3 items-start">
                <span className="font-mono text-xs text-muted">
                  {project.year}
                </span>
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-[0.65rem] font-mono tracking-wide ${project.status === 'Completed'
                    ? 'border-line text-muted'
                    : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500 animate-pulse'
                    }`}
                >
                  {project.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl">{project.title}</h3>
                <p className="mt-1 text-sm text-muted">{project.type}</p>

                <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
                  {project.overview}
                </p>

                <div className="mt-6 max-w-prose">
                  <h4 className="text-xs font-mono text-ink dark:text-gray-50 mb-3 uppercase tracking-wider">Key Features</h4>
                  <ul className="space-y-2">
                    {project.features.map((feature, fIdx) => {
                      const splitIdx = feature.indexOf(':');
                      if (splitIdx === -1) {
                        return (
                          <li key={fIdx} className="text-sm leading-relaxed text-muted flex gap-2">
                            <span className="text-accent mt-1 opacity-60">▹</span>
                            <span>{feature}</span>
                          </li>
                        );
                      }

                      const title = feature.slice(0, splitIdx);
                      const desc = feature.slice(splitIdx + 1);

                      return (
                        <li key={fIdx} className="text-sm leading-relaxed text-muted flex gap-2">
                          <span className="text-accent mt-1 opacity-60">▹</span>
                          <span>
                            <span className="font-medium text-ink dark:text-gray-50">{title}:</span>{desc}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line px-3 py-1 text-[0.65rem] tracking-wide text-muted uppercase font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
