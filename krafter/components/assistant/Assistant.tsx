"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { answerLocally, type AssistantLink } from "@/lib/assistant/engine";
import { ArrowRight } from "@/components/navigation/Glyphs";
import { cn } from "@/lib/utils/cn";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
  links?: AssistantLink[];
};

const REMOTE_ENDPOINT = process.env.NEXT_PUBLIC_ASSISTANT_ENDPOINT;

/**
 * Layer C — KRAFTER / GUIDANCE.
 * Centred dialog on desktop, full-screen sheet on mobile.
 * Pre-programmed answers; a real API can be wired through
 * NEXT_PUBLIC_ASSISTANT_ENDPOINT without touching this component.
 */
export function Assistant() {
  const { t, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);
  const counter = useRef(0);

  const nextId = () => {
    counter.current += 1;
    return counter.current;
  };

  const resetConversation = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    counter.current = 0;
    setMessages([{ id: nextId(), role: "assistant", text: t.assistant.greeting }]);
    setTyping(false);
    setNotice(null);
  };

  // Open / close plumbing: scroll lock, focus, escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) root.classList.add("no-scroll");
    setMessages((current) =>
      current.length > 0 ? current : [{ id: nextId(), role: "assistant", text: t.assistant.greeting }],
    );
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      root.classList.remove("no-scroll");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, t.assistant.greeting]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  // Keep the log pinned to the latest message.
  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 40);
  };

  const ask = async (raw: string) => {
    const value = raw.trim();
    if (!value || typing) return;
    setDraft("");
    setMessages((current) => [...current, { id: nextId(), role: "user", text: value }]);
    setTyping(true);

    const localReply = answerLocally(value, locale, t);

    if (REMOTE_ENDPOINT) {
      try {
        const response = await fetch(REMOTE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: value, locale }),
        });
        if (!response.ok) throw new Error(`Assistant endpoint returned ${response.status}`);
        const data = (await response.json()) as { reply?: string; links?: AssistantLink[] };
        if (!data.reply) throw new Error("Empty assistant reply");
        setTyping(false);
        setMessages((current) => [
          ...current,
          { id: nextId(), role: "assistant", text: data.reply as string, links: data.links ?? [] },
        ]);
        return;
      } catch {
        setNotice(t.assistant.engineNotice);
      }
    }

    const timer = window.setTimeout(() => {
      setTyping(false);
      setMessages((current) => [
        ...current,
        { id: nextId(), role: "assistant", text: localReply.text, links: localReply.links },
      ]);
    }, 420);
    timers.current.push(timer);
  };

  return (
    <>
      <button
        type="button"
        ref={launcherRef}
        className="assistant-launcher glass"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t.assistant.launcherLong}
        data-open={open ? "true" : "false"}
        inert={open}
      >
        <span className="assistant-launcher__glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M4 6.5h16v9.2H10.6L6.6 19v-3.3H4z" strokeLinejoin="round" />
            <path d="M8.4 10.2h.01M12 10.2h.01M15.6 10.2h.01" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </span>
        <span className="assistant-launcher__label">{t.assistant.launcher}</span>
        <span className="assistant-launcher__pulse" aria-hidden="true" />
      </button>

      <div
        className="assistant-layer"
        data-open={open ? "true" : "false"}
        aria-hidden={open ? undefined : true}
        inert={!open}
      >
        <button
          type="button"
          className="assistant-backdrop"
          onClick={close}
          tabIndex={-1}
          aria-label={t.assistant.close}
        />

        <div
          className="assistant-panel glass glass--strong"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
        >
          <header className="assistant-panel__head">
            <div className="assistant-panel__heading">
              <span className="meta assistant-panel__kicker">{t.assistant.subtitle}</span>
              <h2 id="assistant-title" className="assistant-panel__title">
                {t.assistant.title}
              </h2>
            </div>
            <div className="assistant-panel__actions">
              <button
                type="button"
                className="assistant-panel__action"
                onClick={resetConversation}
                title={t.assistant.newConversation}
              >
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M3.5 10a6.5 6.5 0 1 1 2 4.7" strokeLinecap="round" />
                  <path d="M3.2 5.6v4.2h4.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{t.assistant.newConversation}</span>
              </button>
              <button type="button" className="assistant-panel__close" onClick={close}>
                <span className="assistant-panel__close-label">{t.assistant.close}</span>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="m4 4 12 12M16 4 4 16" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          <p className="assistant-panel__notice">
            <span className="orange-dot" aria-hidden="true" />
            {notice ?? t.assistant.engineNotice}
          </p>

          <div className="assistant-log" ref={logRef} aria-live="polite" aria-atomic="false">
            {messages.map((message) => (
              <div key={message.id} className={cn("assistant-msg", `assistant-msg--${message.role}`)}>
                <span className="assistant-msg__author meta">
                  {message.role === "assistant" ? "KRAFTER" : t.assistant.you}
                </span>
                <div className="assistant-msg__bubble">
                  <p>{message.text}</p>
                  {message.links && message.links.length > 0 ? (
                    <div className="assistant-msg__links">
                      {message.links.map((link) => (
                        <Link
                          key={`${message.id}-${link.href}`}
                          href={link.href}
                          className="assistant-msg__link"
                          onClick={close}
                        >
                          {link.label}
                          <ArrowRight size={12} />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {typing ? (
              <div className="assistant-msg assistant-msg--assistant">
                <span className="assistant-msg__author meta">KRAFTER</span>
                <div className="assistant-msg__bubble assistant-msg__bubble--typing">
                  <span className="sr-only">{t.assistant.typing}</span>
                  <span className="assistant-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {messages.length <= 1 ? (
            <div className="assistant-suggestions">
              <span className="meta">{t.assistant.quickLabel}</span>
              <div className="assistant-suggestions__list">
                {t.assistant.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="assistant-chip"
                    onClick={() => ask(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <form
            className="assistant-form"
            onSubmit={(event) => {
              event.preventDefault();
              void ask(draft);
            }}
          >
            <label htmlFor="assistant-input" className="sr-only">
              {t.assistant.placeholder}
            </label>
            <input
              id="assistant-input"
              ref={inputRef}
              className="assistant-form__input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t.assistant.placeholder}
              autoComplete="off"
              enterKeyHint="send"
            />
            <button type="submit" className="assistant-form__send" disabled={!draft.trim() || typing}>
              <span className="sr-only">{t.assistant.send}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
