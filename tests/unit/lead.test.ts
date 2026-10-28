import { describe, expect, it, vi } from 'vitest';
import { HONEYPOT_FIELD, handleLead, parseLead } from '../../src/lib/lead';

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
}

function post(fields: Record<string, string>, accept = 'application/json'): Request {
  return new Request('https://site.example.com/api/lead', { method: 'POST', body: form(fields), headers: { accept } });
}

const okFetch = () => vi.fn(async () => new Response('ok', { status: 200 }));
const env = { LEAD_WEBHOOK_URL: 'https://hooks.example.com/lead', LEAD_WEBHOOK_SECRET: 's3cret' };
const valid = { name: 'Dana', email: 'dana@example.com', message: 'Leaky tap', page: '/contact/', form: 'contact' };

describe('parseLead', () => {
  it('needs a name and an email or phone', () => {
    expect(parseLead(form({ email: 'a@b.co' }))).toMatchObject({ ok: false, error: 'Please add your name.' });
    expect(parseLead(form({ name: 'A' }))).toMatchObject({ ok: false, error: 'Please add an email or phone number.' });
    expect(parseLead(form({ name: 'A', phone: '555' }))).toMatchObject({ ok: true });
  });

  it('rejects a malformed email', () => {
    expect(parseLead(form({ name: 'A', email: 'nope' }))).toMatchObject({ ok: false, spam: false });
  });

  it('trims and caps field lengths', () => {
    const r = parseLead(form({ name: `  ${'x'.repeat(500)} `, phone: '1' }));
    expect(r.ok && r.lead.name.length).toBe(120);
  });
});

describe('handleLead', () => {
  it('forwards a valid lead as JSON with the secret header', async () => {
    const fetchImpl = okFetch();
    const res = await handleLead(post(valid), env, fetchImpl);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(env.LEAD_WEBHOOK_URL);
    expect((init.headers as Record<string, string>)['x-lead-secret']).toBe('s3cret');
    expect(JSON.parse(init.body as string)).toMatchObject({ name: 'Dana', email: 'dana@example.com', form: 'contact' });
  });

  it('accepts spam silently and never forwards it', async () => {
    const fetchImpl = okFetch();
    const res = await handleLead(post({ ...valid, [HONEYPOT_FIELD]: 'http://spam' }), env, fetchImpl);
    expect(res.status).toBe(200);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns 400 with a message for missing fields', async () => {
    const res = await handleLead(post({ email: 'a@b.co' }), env, okFetch());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'Please add your name.' });
  });

  it('returns 502 when the webhook fails, never a fake success', async () => {
    const failing = vi.fn(async () => new Response('down', { status: 503 }));
    const res = await handleLead(post(valid), env, failing);
    expect(res.status).toBe(502);
    const throwing = vi.fn(async () => {
      throw new Error('network');
    });
    expect((await handleLead(post(valid), env, throwing)).status).toBe(502);
  });

  it('returns 500 when no webhook is configured', async () => {
    expect((await handleLead(post(valid), {}, okFetch())).status).toBe(500);
  });

  it('redirects to /thanks/ for a browser post without JavaScript', async () => {
    const res = await handleLead(post(valid, 'text/html,application/xhtml+xml'), env, okFetch());
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('https://site.example.com/thanks/');
  });

  it('redirects to the fallback page for a failed no-JS post', async () => {
    const res = await handleLead(post({ email: 'a@b.co' }, 'text/html'), env, okFetch());
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('https://site.example.com/form-error/');
  });
});
