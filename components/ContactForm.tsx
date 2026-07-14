'use client';

import { useState, FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'sent' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      // Wire this endpoint up to your form handler of choice
      // (Formspree, Resend, a custom API route, etc).
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8">
        <p className="font-mono text-xs text-accent">message sent</p>
        <p className="mt-2 font-display text-ink">
          Message received. I read every one personally — expect a reply within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field to prevent automated spam */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="botField">Don't fill this out if you're human:</label>
        <input id="botField" name="botField" type="text" tabIndex={-1} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Subject" name="subject" type="text" />
      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors duration-300 focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-colors duration-300 ease-exec hover:bg-accent disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600">
          Something went wrong — please try again, or email Omar directly.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors duration-300 focus:border-accent"
      />
    </div>
  );
}
