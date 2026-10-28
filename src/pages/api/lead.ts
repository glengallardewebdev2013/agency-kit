// POST /api/lead: runs on Cloudflare (not prerendered) and forwards leads to
// the LEAD_WEBHOOK_URL secret.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { handleLead, type LeadEnv } from '../../lib/lead';

export const prerender = false;

export const POST: APIRoute = ({ request }) => handleLead(request, env satisfies LeadEnv);
