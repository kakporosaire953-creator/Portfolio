"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHead } from "@/components/layout/PageHead";
import { ContactBand } from "@/components/sections/ContactBand";
import { profile } from "@/data/profile";
import { ArrowRight, ArrowUpRight } from "@/components/navigation/Glyphs";
import { asset } from "@/lib/utils/asset";

type Status = "idle" | "sending" | "success" | "error";

type Values = { name: string; email: string; type: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactView() {
  const { t, locale } = useLocale();
  const types = t.contact.form.projectTypes;

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    type: types[0],
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const setField = (field: keyof Values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t.contact.form.required;
    if (!values.email.trim()) next.email = t.contact.form.required;
    else if (!EMAIL_RE.test(values.email.trim())) next.email = t.contact.form.invalidEmail;
    if (values.message.trim().length < 20) next.message = t.contact.form.minMessage;
    return next;
  };

  const mailtoHref = useMemo(() => {
    const subject = `[THE KRAFTER] ${values.type || "Nouveau projet"} — ${values.name || ""}`.trim();
    const body = [
      `${t.contact.form.name}: ${values.name}`,
      `${t.contact.form.email}: ${values.email}`,
      `${t.contact.form.projectType}: ${values.type}`,
      "",
      values.message,
    ].join("\n");
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [t.contact.form, values]);

  const briefText = useMemo(
    () =>
      [
        `${t.contact.form.name}: ${values.name}`,
        `${t.contact.form.email}: ${values.email}`,
        `${t.contact.form.projectType}: ${values.type}`,
        "",
        values.message,
      ].join("\n"),
    [t.contact.form, values],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(asset("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale, honeypot }),
      });
      if (!response.ok) {
        // 404 (static hosting) and 503 (no provider configured) mean the same
        // thing for the visitor: the brief was not sent. The panel below offers
        // the working mailto + copy fallbacks.
        setStatus("error");
        return;
      }
      setStatus("success");
      setValues({ name: "", email: "", type: types[0], message: "" });
    } catch {
      setStatus("error");
    }
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <PageHead
        index="07"
        kicker={t.contact.kicker}
        title={
          <>
            {t.contact.title.split(" ").slice(0, -1).join(" ")}{" "}
            <em>{t.contact.title.split(" ").slice(-1)}</em>
          </>
        }
        lede={t.contact.intro}
        meta={[
          { label: t.contact.availabilityLabel, value: t.contact.availabilityValue },
          { label: t.contact.responseLabel, value: t.contact.responseValue },
        ]}
      />

      <section className="section-tight">
        <div className="shell">
          <div className="contact-layout">
            <aside className="contact-aside">
              <span className="contact-availability">
                <span className="orange-dot" aria-hidden="true" />
                {t.contact.availabilityValue}
              </span>

              <dl className="contact-facts">
                <div className="contact-fact">
                  <dt>{t.contact.emailLabel}</dt>
                  <dd>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </dd>
                </div>
                <div className="contact-fact">
                  <dt>{t.contact.locationLabel}</dt>
                  <dd>
                    {profile.city}, {profile.country[locale]}
                  </dd>
                </div>
                <div className="contact-fact">
                  <dt>{t.contact.responseLabel}</dt>
                  <dd>{t.contact.responseValue}</dd>
                </div>
                <div className="contact-fact">
                  <dt>{t.footer.elsewhereTitle}</dt>
                  <dd>
                    <a href={profile.github} target="_blank" rel="noreferrer noopener">
                      GitHub ↗
                      <span className="sr-only"> ({t.a11y.newTab})</span>
                    </a>
                  </dd>
                </div>
              </dl>

              <p className="body-sm" style={{ maxWidth: "26rem" }}>
                {t.contact.form.notice}
              </p>
            </aside>

            <div>
              {status === "success" ? (
                <div className="form-status form-status--success" role="status">
                  <h2 className="form-status__title">{t.contact.form.successTitle}</h2>
                  <p className="form-status__text">{t.contact.form.successText}</p>
                  <div className="form-status__actions">
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStatus("idle")}>
                      {t.contact.form.reset}
                    </button>
                    <a href={`mailto:${profile.email}`} className="btn btn--orange btn--sm">
                      {t.contact.emailLabel}
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              ) : (
                <form className="contact-form" onSubmit={onSubmit} noValidate>
                  <div className="contact-form__head">
                    <h2 className="contact-form__title">{t.contact.form.title}</h2>
                    <span className="meta">{t.contact.responseValue}</span>
                  </div>

                  {status === "error" ? (
                    <div className="form-status form-status--error" role="alert">
                      <h3 className="form-status__title">{t.contact.form.errorTitle}</h3>
                      <p className="form-status__text">{t.contact.form.errorText}</p>
                      <div className="form-status__actions">
                        <a href={mailtoHref} className="btn btn--orange btn--sm">
                          {t.contact.form.fallbackMailto}
                          <ArrowUpRight size={12} />
                        </a>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={copyBrief}>
                          {copied ? t.contact.form.copied : t.contact.form.fallbackCopy}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="contact-form__grid">
                    <div className="field" data-invalid={Boolean(errors.name)}>
                      <label className="field__label" htmlFor="contact-name">
                        {t.contact.form.name}
                        <span className="field__required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        id="contact-name"
                        className="field__input"
                        value={values.name}
                        onChange={setField("name")}
                        placeholder={t.contact.form.namePlaceholder}
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                      />
                      {errors.name ? (
                        <span className="field__error" id="contact-name-error">
                          {errors.name}
                        </span>
                      ) : null}
                    </div>

                    <div className="field" data-invalid={Boolean(errors.email)}>
                      <label className="field__label" htmlFor="contact-email">
                        {t.contact.form.email}
                        <span className="field__required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        className="field__input"
                        value={values.email}
                        onChange={setField("email")}
                        placeholder={t.contact.form.emailPlaceholder}
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                      />
                      {errors.email ? (
                        <span className="field__error" id="contact-email-error">
                          {errors.email}
                        </span>
                      ) : null}
                    </div>

                    <div className="field field--full">
                      <label className="field__label" htmlFor="contact-type">
                        {t.contact.form.projectType}
                      </label>
                      <select
                        id="contact-type"
                        className="field__select"
                        value={values.type}
                        onChange={setField("type")}
                      >
                        {types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field field--full" data-invalid={Boolean(errors.message)}>
                      <label className="field__label" htmlFor="contact-message">
                        {t.contact.form.message}
                        <span className="field__required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <textarea
                        id="contact-message"
                        className="field__textarea"
                        value={values.message}
                        onChange={setField("message")}
                        placeholder={t.contact.form.messagePlaceholder}
                        aria-required="true"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                      />
                      {errors.message ? (
                        <span className="field__error" id="contact-message-error">
                          {errors.message}
                        </span>
                      ) : null}
                    </div>

                    {/* honeypot — hidden from users and assistive tech */}
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="contact-form__foot">
                    <button
                      type="submit"
                      className="btn btn--orange"
                      disabled={status === "sending"}
                      aria-busy={status === "sending"}
                    >
                      {status === "sending" ? t.contact.form.sending : t.contact.form.submit}
                      <ArrowRight size={13} />
                    </button>
                    <p className="contact-form__privacy">{t.contact.form.privacy}</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
