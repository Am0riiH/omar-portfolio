import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import './globals.css';

// next/font self-hosts and subsets Google Fonts at build time — no
// render-blocking network request, no layout shift, and only the
// weights actually used ship to the browser.
const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://amoridev.com'),
  title: {
    default: 'Omar Hussein | Front-End Developer',
    template: '%s | Omar Hussein',
  },
  description:
    'Omar Hussein is a Front-End Developer and systems-minded IT & Computer Science professional specializing in React, Next.js, and Tailwind CSS.',
  openGraph: {
    title: 'Omar Hussein | Front-End Developer',
    description:
      'Front-End Developer and systems-minded IT & Computer Science professional specializing in React, Next.js, and Tailwind CSS.',
    type: 'website',
    url: 'https://amoridev.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Hussein | Front-End Developer',
    description: 'Front-End Developer specializing in React, Next.js, and Tailwind CSS.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col relative bg-paper text-ink dark:bg-zinc-950 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnimatedBackground />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
