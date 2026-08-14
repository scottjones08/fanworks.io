import { FormEvent, useState } from "react";
import { useReveal } from "../hooks/useReveal";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const copyRef = useReveal<HTMLDivElement>();
  const formRef = useReveal<HTMLFormElement>();

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const message = String(form.get("message") || "");
    const subject = encodeURIComponent(`FanWorks conversation: ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${form.get("email") || ""}`);
    setSubmitted(true);
    window.location.href = `mailto:hello@fanworks.io?subject=${subject}&body=${body}`;
  };

  return (
    <section className="engage" id="engage" aria-labelledby="engage-title">
      <div className="engage-grid">
        <div className="reveal" ref={copyRef}>
          <div className="section-kicker kicker-ink">
            <i />
            07 · Contact
          </div>
          <h2 id="engage-title">What is slowing you down?</h2>
          <p>Tell us where the day grinds. If we can help, we'll say how. If we can't, we'll say that too.</p>
          <a className="mail-link" href="mailto:hello@fanworks.io">
            hello@fanworks.io
          </a>
        </div>

        <form className="contact-form reveal" ref={formRef} onSubmit={submitContact}>
          <div className="form-row">
            <label>
              <span>Name</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>
          <label>
            <span>What should we look at?</span>
            <textarea name="message" rows={4} required />
          </label>
          <div className="form-footer">
            <button className="cta cta-ink" type="submit">
              {submitted ? "Sent" : "Send it"} →
            </button>
            <p role="status">{submitted ? "Your email app is ready." : "A few honest lines are enough."}</p>
          </div>
        </form>
      </div>

      <footer className="site-footer">
        <span className="wordmark">FANWORKS</span>
        <span>Business systems consulting</span>
        <span>Richmond, Virginia</span>
        <span>Est. 2025</span>
      </footer>
    </section>
  );
}
