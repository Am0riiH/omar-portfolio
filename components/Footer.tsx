const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Am0riiH' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/am0rih/' },
  { label: 'Email', href: 'mailto:omar.bin7ussien@gmail.com' },
];

export default function Footer() {
  return (
    <footer className="hairline mt-32">
      <div className="section flex flex-col gap-6 pt-10 pb-2 md:flex-row md:items-center md:justify-between">
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          status: open to front-end roles &middot; {new Date().getFullYear()}
        </p>
        <ul className="flex gap-6">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                className="text-sm text-muted transition-colors duration-300 hover:text-ink dark:hover:text-gray-50"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="section pb-8">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Omar Hussein. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
