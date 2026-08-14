import { FormEvent, useState } from "react";
import { CtaButton } from "./CtaButton";
import { Reveal } from "./Reveal";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

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
    <section className="engage-section" id="engage" aria-labelledby="engage-title">
      <div className="engage-copy">
        <Reveal className="section-mark section-mark-light">
          <span>04</span>
          <span>Contact</span>
        </Reveal>
        <Reveal>
          <h2 id="engage-title">What is slowing you down?</h2>
          <a href="mailto:hello@fanworks.io">hello@fanworks.io</a>
        </Reveal>
      </div>

      <Reveal className="contact-form-wrap" amount={0.18}>
        <form className="contact-form" onSubmit={submitContact}>
          <div className="form-row">
            <label className="field">
              <span>Name</span>
              <input name="name" autoComplete="name" placeholder=" " required />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" placeholder=" " required />
            </label>
          </div>
          <label className="field">
            <span>What should we look at?</span>
            <textarea name="message" rows={4} placeholder=" " required />
          </label>
          <div className="form-footer">
            <CtaButton type="submit" className="submit-cta">
              Send it
            </CtaButton>
            <p role="status">{submitted ? "Your email app is ready." : "A few honest lines are enough."}</p>
          </div>
        </form>
      </Reveal>
    </section>
  );
}
