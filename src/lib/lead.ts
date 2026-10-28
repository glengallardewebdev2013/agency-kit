export interface LeadEnv {
  /** Where leads are forwarded as JSON (Zapier, Make, Slack, a CRM webhook...). */
  LEAD_WEBHOOK_URL?: string;
  /** Optional shared secret sent as the X-Lead-Secret header. */
  LEAD_WEBHOOK_SECRET?: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  message: string;
  page: string;
  form: string;
  submittedAt: string;
}

/** Hidden field real visitors never fill in. */
export const HONEYPOT_FIELD = 'company_website';

const LIMITS = { name: 120, email: 200, phone: 40, message: 5000, page: 300, form: 60 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(data: FormData, key: keyof typeof LIMITS): string {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim().slice(0, LIMITS[key]) : '';
}

export type ParseResult = { ok: true; lead: Lead } | { ok: false; spam: true } | { ok: false; spam: false; error: string };

export function parseLead(data: FormData, now = new Date()): ParseResult {
  const trap = data.get(HONEYPOT_FIELD);
  if (typeof trap === 'string' && trap.trim() !== '') return { ok: false, spam: true };

  const lead: Lead = {
    name: field(data, 'name'),
    email: field(data, 'email'),
    phone: field(data, 'phone'),
    message: field(data, 'message'),
    page: field(data, 'page'),
    form: field(data, 'form') || 'contact',
    submittedAt: now.toISOString(),
  };
  if (!lead.name) return { ok: false, spam: false, error: 'Please add your name.' };
  if (!lead.email && !lead.phone) return { ok: false, spam: false, error: 'Please add an email or phone number.' };
  if (lead.email && !EMAIL.test(lead.email)) return { ok: false, spam: false, error: 'That email address looks incomplete.' };
  return { ok: true, lead };
}

function wantsHtml(request: Request): boolean {
  const accept = request.headers.get('accept') ?? '';
  return accept.includes('text/html') && !accept.includes('application/json');
}

function respond(request: Request, status: number, body: { ok: boolean; error?: string }): Response {
  if (wantsHtml(request)) {
    // A static page can't show a dynamic message without JavaScript, so a
    // failed no-JS post lands on a page with the phone and email fallback.
    const target = body.ok ? '/thanks/' : '/form-error/';
    return new Response(null, { status: 303, headers: { location: new URL(target, request.url).toString() } });
  }
  return Response.json(body, { status });
}

export async function handleLead(request: Request, env: LeadEnv, fetchImpl: typeof fetch = fetch): Promise<Response> {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return respond(request, 400, { ok: false, error: 'The form could not be read.' });
  }

  const parsed = parseLead(data);
  // Spam gets a normal-looking success so bots learn nothing.
  if (!parsed.ok && parsed.spam) return respond(request, 200, { ok: true });
  if (!parsed.ok) return respond(request, 400, { ok: false, error: parsed.error });

  if (!env.LEAD_WEBHOOK_URL) {
    return respond(request, 500, { ok: false, error: 'The form is not set up yet.' });
  }

  try {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (env.LEAD_WEBHOOK_SECRET) headers['x-lead-secret'] = env.LEAD_WEBHOOK_SECRET;
    const res = await fetchImpl(env.LEAD_WEBHOOK_URL, { method: 'POST', headers, body: JSON.stringify(parsed.lead) });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch {
    return respond(request, 502, { ok: false, error: 'We could not send your message.' });
  }
  return respond(request, 200, { ok: true });
}
