# Omar Hussein — Portfolio

Multi-page Next.js (App Router) portfolio. Modern Minimalist / Executive
design system: paper-and-ink palette, a single restrained signal-blue
accent, Fraunces + Inter + JetBrains Mono type system, and a recurring
"route/hop" motif that nods to Omar's networking background without
becoming a gimmick.

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build && npm start
```

## Wiring the contact form

`components/ContactForm.tsx` posts JSON to `/api/contact`. Add a route
handler at `app/api/contact/route.ts` that forwards to your email
provider of choice (Resend, Postmark, Formspree, etc.) — this was left
as an integration point since it depends on your provider/API keys.

## Structure

See the project directory listing for the full route map. Every route
under `app/` is a separate page (Next's file-system router), so each
one code-splits automatically — no route ships more JavaScript than it
needs.
