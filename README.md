# Omar Hussein — Portfolio

> Interfaces engineered with the same precision as a routing table.

A fully custom front-end portfolio built to reflect a systems-first approach to interface 
engineering — where every component is architected like infrastructure: predictable, 
fault-tolerant, and built to hold under load.

**Live site:** [amoridev.com](https://amoridev.com)

---

## Overview

This portfolio isn't a template — it's a hand-built, from-scratch application demonstrating 
production-level front-end engineering practices: accessible design, optimized performance, 
secure server-side logic, and a fully custom design system.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Theme System:** next-themes (system-aware dark mode with manual override)
- **Email:** Resend (transactional email API)
- **Spam Protection:** Cloudflare Turnstile (CAPTCHA) + honeypot field + IP-based rate limiting
- **Deployment:** Vercel
- **Domain & DNS:** Vercel Domains + ImprovMX (email forwarding)

## Key Features

- 🌓 **Adaptive theming** — respects OS/browser preference by default, with a manual 
  light/dark toggle that persists across sessions
- ✉️ **Secure contact form** — layered protection via Turnstile CAPTCHA, honeypot 
  detection, server-side input sanitization, and rate limiting
- 🎨 **Custom animated iconography** — hand-built SVG logo with a live terminal-cursor 
  blink animation, plus a color-scheme-aware favicon
- ⚡ **Performance-first** — Lighthouse scores: **100 Accessibility**, **100 Best 
  Practices**, **100 SEO**, **94-100 Performance**
- 🖱️ **Micro-interactions** — subtle hover states, frosted-glass button effects, and 
  scroll-aware particle background
- 📱 **Fully responsive** — tested across mobile, tablet, and desktop breakpoints

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

### Environment Variables

Create a `.env.local` file with:

```
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

## Project Structure

```
├── app/                  # Next.js App Router pages & API routes
│   ├── api/contact/      # Contact form endpoint (Resend + Turnstile + rate limiting)
│   ├── about/
│   ├── skills/
│   ├── certifications/
│   ├── portfolio/
│   └── contact/
├── components/           # Reusable UI components
└── public/               # Static assets
```

## Performance & Security

- WCAG AA contrast compliance across light and dark modes
- Server-side email sanitization to prevent HTML injection
- Environment secrets never exposed client-side
- Dependency vulnerabilities monitored via `npm audit`

## Author

**Omar Hussein** — Front-End Developer  
[GitHub](https://github.com/Am0riiH) · [LinkedIn](https://www.linkedin.com/in/am0rih/) · [amoridev.com](https://amoridev.com)

---

*Built with intention — every interface shipped is deliberate.*
