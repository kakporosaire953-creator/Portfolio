import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Assistant endpoint — intentionally not connected to any model.
 *
 * The portfolio ships a pre-programmed assistant (lib/assistant/engine.ts) so
 * every answer is honest and works offline. To connect a real model, point
 * ASSISTANT_API_URL (any endpoint with a {message, locale} → {reply} contract)
 * and ASSISTANT_API_KEY here, then set NEXT_PUBLIC_ASSISTANT_ENDPOINT=/api/assistant
 * for the client.
 */
export async function POST(request: Request) {
  const apiUrl = process.env.ASSISTANT_API_URL;
  const apiKey = process.env.ASSISTANT_API_KEY;

  if (!apiUrl) {
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message:
          "No assistant model is configured. The client falls back to the local, pre-programmed engine.",
      },
      { status: 501 },
    );
  }

  let body: { message?: string; locale?: string };
  try {
    body = (await request.json()) as { message?: string; locale?: string };
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  if (!body.message) {
    return NextResponse.json({ ok: false, code: "invalid_input" }, { status: 422 });
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ message: body.message, locale: body.locale ?? "fr" }),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, code: "provider_error" }, { status: 502 });
    }

    const data = (await response.json()) as { reply?: string; links?: unknown };
    if (!data.reply) {
      return NextResponse.json({ ok: false, code: "empty_reply" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, reply: data.reply, links: data.links ?? [] });
  } catch {
    return NextResponse.json({ ok: false, code: "network_error" }, { status: 502 });
  }
}
