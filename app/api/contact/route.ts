import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter for the contact API.
// Note: This resets on server restart and won't work across multiple server instances.
// For production scale with high traffic, replace this with Upstash Redis.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3;

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

// Strip invisible/non-ASCII characters that can cause 422 validation errors
function sanitizeInvisible(str: any): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[\u200B-\u200F\uFEFF\u202A-\u202E\uFE00-\uFE0F]/g, '').trim();
}

// Simple HTML escape to prevent XSS in email bodies
function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return match;
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const botField = body.botField;
    const name = sanitizeInvisible(body.name);
    const email = sanitizeInvisible(body.email);
    const subject = sanitizeInvisible(body.subject);
    const message = sanitizeInvisible(body.message);

    // Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }

    // 1. Honeypot check: If the hidden 'botField' is filled out, silently reject it as spam
    if (botField) {
      console.warn('Spam submission blocked by honeypot');
      return NextResponse.json(
        { success: false, error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // 2. Server-side validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isAscii = /^[\x00-\x7F]+$/;
    if (!isAscii.test(email) || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address using standard characters.' },
        { status: 400 }
      );
    }

    // 3. Send email using Resend
    // Replace 'YOUR_EMAIL@example.com' with the email where you want to receive messages.
    // Ensure you have verified your sending domain or are using the test environment.
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>', // Update this to your verified domain e.g., 'hello@yourdomain.com'
      to: 'omar.bin7ussien@gmail.com',
      replyTo: email,
      subject: subject ? `New Portfolio Message: ${subject}` : `New Portfolio Message from ${name}`,
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
      console.error('Resend API Error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Contact Form Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}