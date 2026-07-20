import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Resend client — API key is server-only and never exposed to the browser.
const resend = new Resend(process.env.RESEND_API_KEY);

// ---------------------------------------------------------------------------
// Rate limiter — in-memory sliding window (resets on cold start).
// Adequate for a personal portfolio; replace with Upstash Redis if traffic
// ever warrants a multi-instance deployment.
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

// ---------------------------------------------------------------------------
// Input sanitisers
// ---------------------------------------------------------------------------

/**
 * Strips invisible Unicode characters (zero-width spaces, directional
 * overrides, variation selectors) that can sneak through copy-paste and
 * trigger Resend's 422 validation errors without being visible to the sender.
 */
function sanitizeInvisible(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u200B-\u200F\uFEFF\u202A-\u202E\uFE00-\uFE0F]/g, '').trim();
}

/** Escapes the five HTML special characters to prevent XSS in email bodies. */
function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':  return '&amp;';
      case '<':  return '&lt;';
      case '>':  return '&gt;';
      case '"':  return '&quot;';
      case "'":  return '&#39;';
      default:   return char;
    }
  });
}

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------

// Basic patterns — intentionally simple; the goal is to catch obvious mistakes,
// not to fully validate per RFC 5322 (which would be overkill here).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ASCII_ONLY = /^[\x00-\x7F]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const honeypot      = body.botField;
    const turnstileToken = body.turnstileToken;
    const name          = sanitizeInvisible(body.name);
    const email         = sanitizeInvisible(body.email);
    const subject       = sanitizeInvisible(body.subject);
    const message       = sanitizeInvisible(body.message);

    // 1. Cloudflare Turnstile — must pass before any other processing.
    //    The secret is server-only; the token is single-use and verified
    //    directly with Cloudflare so it cannot be replayed or spoofed.
    const turnstileRes  = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret:   process.env.TURNSTILE_SECRET_KEY ?? '',
          response: turnstileToken ?? '',
        }),
      }
    );
    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // 2. Rate limiting — checked after CAPTCHA so bots pay the verification
    //    cost before hitting this cheaper in-memory guard.
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }

    // 3. Honeypot — the field is hidden from real users via CSS + aria-hidden.
    //    A filled value means a bot is submitting the form.
    if (honeypot) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission.' },
        { status: 400 }
      );
    }

    // 4. Field validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    if (!ASCII_ONLY.test(email) || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address using standard characters.' },
        { status: 400 }
      );
    }

    // 5. Send via Resend
    const { data, error } = await resend.emails.send({
      from:    'Omar Hussein <hello@amoridev.com>',
      to:      'omar.bin7ussien@gmail.com',
      replyTo: email,
      subject: subject
        ? `New Portfolio Message: ${subject}`
        : `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || 'No subject provided')}</p>
        <hr />
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Contact route unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}