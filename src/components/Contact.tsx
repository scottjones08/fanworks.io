import { ArrowUpRight, Check, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useEffect, useRef, useState } from "react";

type FormState = "idle" | "sending" | "sent" | "error";

type ContactProps = {
  brief: string;
  briefRequestVersion: number;
};

export function Contact({ brief, briefRequestVersion }: ContactProps) {
  const [state, setState] = useState<FormState>("idle");
  const [status, setStatus] = useState("A few honest lines are enough.");
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (briefRequestVersion > 0) {
      setMessage(brief);
      setStatus("Your Workday MRI was added as a draft. Edit anything you like.");
      setState("idle");
      messageRef.current?.focus({ preventScroll: true });
    }
  }, [brief, briefRequestVersion]);

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
          message,
          company: String(data.get("company") || ""),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not send that just now.");
      setState("sent");
      setStatus("Received. We'll read it and reply.");
      setMessage("");
      form.reset();
    } catch (error) {
      setState("error");
      setStatus(error instanceof Error ? error.message : "Could not send that just now. Email hello@fanworks.io.");
    }
  };

  return (
    <section className="engage section-pad" id="engage" aria-labelledby="engage-title">
      <div className="section-marker">
        <span>06</span>
        <i />
        <span>Start here</span>
      </div>
      <div className="engage-grid">
        <div className="engage-copy">
          <p className="eyebrow eyebrow-dark">Bring us the hard handoff</p>
          <h2 id="engage-title">What is making the day heavier?</h2>
          <p>
            Tell us where the work doubles back. If we can help, we will say how. If we cannot, we
            will say that too.
          </p>
          <a href="mailto:hello@fanworks.io">
            <EnvelopeSimple size={20} weight="bold" /> hello@fanworks.io <ArrowUpRight size={18} weight="bold" />
          </a>

          <AnimatePresence>
            {briefRequestVersion > 0 ? (
              <motion.div
                className="brief-added"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Check size={18} weight="bold" />
                <div>
                  <strong>Your map is in the draft.</strong>
                  <span>Nothing has been sent. Review it before you choose to submit.</span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <form className="contact-form" onSubmit={submitContact}>
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
              id="contact-message"
              ref={messageRef}
              name="message"
              rows={9}
              required
              minLength={8}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="The handoff that is slowing us down is…"
              disabled={state === "sending" || state === "sent"}
            />
          </label>
          <div className="form-footer">
            <button className="submit-action" type="submit" disabled={state === "sending" || state === "sent"}>
              {state === "sending" ? "Sending" : state === "sent" ? "Sent" : "Send it"}
              {state === "sent" ? <Check size={19} weight="bold" /> : <PaperPlaneTilt size={19} weight="bold" />}
            </button>
            <p role="status" aria-live="polite" className={state === "error" ? "is-error" : ""}>
              {status}
            </p>
          </div>
        </form>
      </div>

      <footer className="site-footer">
        <strong>fanworks</strong>
        <span>HCD Business Consulting</span>
        <span>Richmond, Virginia</span>
        <span>Est. 2025</span>
      </footer>
    </section>
  );
}
