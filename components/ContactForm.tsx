'use client';

import { useState, useRef, FormEvent } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

type Status = 'idle' | 'submitting' | 'sent' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!turnstileToken) {
      setErrorMsg('Please complete the CAPTCHA check before sending.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      });

      const json = await res.json();

      if (!res.ok) {
        // Show the API's specific error message in the form UI
        setErrorMsg(json.error ?? 'Something went wrong — please try again.');
        setStatus('error');
        // Reset Turnstile so the user can get a fresh token and retry
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }

      setStatus('sent');
      form.reset();
    } catch {
      setErrorMsg('Something went wrong — please try again, or email Omar directly.');
      setStatus('error');
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8">
        <p className="font-mono text-xs text-accent">message sent</p>
        <p className="mt-2 font-display text-ink dark:text-gray-50">
          Message received. I read every one personally — expect a reply within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field to prevent automated spam */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="botField">Don&apos;t fill this out if you&apos;re human:</label>
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
          className="w-full rounded-lg border border-line dark:border-neutral-800 bg-paper dark:bg-zinc-950 px-4 py-3 text-ink dark:text-gray-50 outline-none transition-colors duration-300 focus:border-accent dark:focus:border-blue-400"
        />
      </div>

      {/* Group submit button and CAPTCHA side-by-side on desktop */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'submitting' || !turnstileToken}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-all duration-300 ease-exec hover:bg-accent hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:bg-ink"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>

        {/* Cloudflare Turnstile CAPTCHA — additional layer alongside honeypot + rate limiting.
            Theme "light" matches the site's paper/ink palette.
            Token is single-use; widget auto-resets on error/expiry. */}
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{ theme: 'light' }}
          onSuccess={(token) => {
            setTurnstileToken(token);
            setErrorMsg('');
          }}
          onError={() => {
            setTurnstileToken(null);
            setErrorMsg('CAPTCHA verification failed. Please try again.');
          }}
          onExpire={() => {
            setTurnstileToken(null);
          }}
        />
      </div>

      {status === 'error' && errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
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
        className="w-full rounded-lg border border-line dark:border-neutral-800 bg-paper dark:bg-zinc-950 px-4 py-3 text-ink dark:text-gray-50 outline-none transition-colors duration-300 focus:border-accent dark:focus:border-blue-400"
      />
    </div>
  );
}
