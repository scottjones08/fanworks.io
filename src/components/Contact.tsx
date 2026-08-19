import { FormEvent, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { Lockup } from "./Logo";

type FormState = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [state, setState] = useState<FormState>("idle");
  const [status, setStatus] = useState("A few honest lines are enough.");
  const copyRef = useReveal<HTMLDivElement>();
  const formRef = useReveal<HTMLFormElement>();

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending" || state === "sent") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setStatus("Sending…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          message: String(data.get("message") || ""),
          company: String(data.get("company") || ""),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Could not send that just now.");
      }
      setState("sent");
      setStatus("Received. We'll read it and reply.");
      form.reset();
    } catch (error) {
      setState("error");
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not send that just now. Email hello@fanworks.io.",
      );
    }
  };

  const label =
    state === "sending" ? "Sending…" : state === "sent" ? "Sent" : "Send it";

  return (
    <section className="engage" id="engage" aria-labelledby="engage-title">
      <div className="engage-grid">
        <div className="reveal" ref={copyRef}>
          <div className="section-kicker kicker-ink">
            <i />
            07 · Contact
          </div>
          <h2 id="engage-title">What is slowing you down?</h2>
          <p>
            Tell us where the day grinds. If we can help, we'll say how. If we can't, we'll say
            that too.
          </p>
          <a className="mail-link" href="mailto:hello@fanworks.io">
            hello@fanworks.io
          </a>
        </div>

        <form className="contact-form reveal" ref={formRef} onSubmit={submitContact}>
          <div className="form-row">
            <label>
              <span>Name</span>
              <input name="name" autoComplete="name" required disabled={state === "sending" || state === "sent"} />
            </label>
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={state === "sending" || state === "sent"}
              />
            </label>
          </div>
          <label className="honeypot" aria-hidden="true">
            <span>Company</span>
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
          <label>
            <span>What should we look at?</span>
            <textarea
              name="message"
              rows={4}
              required
              minLength={8}
              disabled={state === "sending" || state === "sent"}
            />
          </label>
          <div className="form-footer">
            <button className="cta cta-ink" type="submit" disabled={state === "sending" || state === "sent"}>
              {label} →
            </button>
            <p role="status" aria-live="polite">
              {status}
            </p>
          </div>
        </form>
      </div>

      <footer className="site-footer">
        <Lockup />
        <span>Richmond, Virginia</span>
        <span>Est. 2025</span>
      </footer>
    </section>
  );
}
