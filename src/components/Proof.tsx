import { ArrowRight, SealCheck } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { scrollToId } from "../content";

export function Proof() {
  return (
    <section className="proof" id="proof" aria-labelledby="proof-title">
      <div className="proof-photo">
        <motion.img
          src="/media/mri/team-handoff.webp"
          alt="A multigenerational team making a real work handoff at an operating counter"
          width={1800}
          height={1200}
          loading="lazy"
          decoding="async"
          initial={{ scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ amount: 0.25 }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
      <div className="proof-shade" aria-hidden="true" />
      <div className="proof-copy">
        <div className="section-marker section-marker-light">
          <span>05</span>
          <i />
          <span>Why FanWorks</span>
        </div>
        <p className="eyebrow">Operators working with operators</p>
        <h2 id="proof-title">We have lived with the system after launch.</h2>
        <p>
          Our team is made of industry executives and entrepreneurs—from founder-led companies to the
          Fortune 500—who have built teams, run production, owned the numbers, and carried the outcome.
        </p>
        <blockquote>“The goal is not more technology. It is less work between the work.”</blockquote>
        <div className="proof-facts">
          <article>
            <strong>20+</strong>
            <span>Years improving operations</span>
          </article>
          <article>
            <SealCheck size={30} weight="duotone" />
            <span>Operator-led from observation through handoff</span>
          </article>
        </div>
        <button className="primary-action" type="button" onClick={() => scrollToId("engage")}>
          Bring us the hard handoff <ArrowRight size={19} weight="bold" />
        </button>
      </div>
    </section>
  );
}
