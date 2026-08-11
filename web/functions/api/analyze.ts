import { generateReport } from '../../../src/report/assembler.js';
import type { Report } from '../../../src/report/types.js';

const MAX_TEXT_LENGTH = 100_000;

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Use POST.' }, 405);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400);
  }

  if (typeof body !== 'object' || body === null || !('text' in body)) {
    return json({ error: "Request body must include a 'text' field." }, 400);
  }

  const { text } = body as { text: unknown };

  if (typeof text !== 'string') {
    return json({ error: "'text' must be a string." }, 400);
  }

  if (text.trim().length === 0) {
    return json({ error: 'Text must not be empty.' }, 400);
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return json(
      { error: `Text must be under ${MAX_TEXT_LENGTH.toLocaleString()} characters.` },
      413,
    );
  }

  try {
    const report: Report = generateReport(text);
    return json({ report }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed.';
    return json({ error: message }, 500);
  }
}
