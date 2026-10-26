import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  type?: string;
  message?: string;
  locale?: string;
  honeypot?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact endpoint.
 *
 * Nothing is connected out of the box: without environment variables the route
 * answers 503 and the UI offers a real mailto fallback. To make it live, set
 * either:
 *   RESEND_API_KEY + CONTACT_TO_EMAIL (+ optional CONTACT_FROM_EMAIL)
 *   or CONTACT_WEBHOOK_URL (any endpoint accepting JSON)
 */
export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  // Honeypot: pretend success so bots do not retry.
  if (payload.honeypot) return NextResponse.json({ ok: true, skipped: true });

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const message = payload.message?.trim() ?? "";
  const type = payload.type?.trim() ?? "";

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 20) {
    return NextResponse.json({ ok: false, code: "invalid_input" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "THE KRAFTER <onboarding@resend.dev>";

  if (apiKey && to) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[THE KRAFTER] ${type || "Nouveau projet"} — ${name}`,
        text: `Nom: ${name}\nE-mail: ${email}\nType: ${type}\nLangue: ${payload.locale ?? "fr"}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, code: "provider_error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, code: "provider_error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    {
      ok: false,
      code: "not_configured",
      message:
        "No email service is configured. Set RESEND_API_KEY + CONTACT_TO_EMAIL, or CONTACT_WEBHOOK_URL. See README.",
    },
    { status: 503 },
  );
}
