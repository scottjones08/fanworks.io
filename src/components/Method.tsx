import { ArrowDownRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { methods } from "../content";

export function Method() {
  return (
    <section className="method" id="method" aria-labelledby="method-title">
      <div className="method-visual">
        <img
          src="/media/mri/operator-observation.webp"
          alt="Operators walking a working factory floor together and listening to the person closest to the work"
          width={1800}
          height={1200}
          loading="lazy"
          decoding="async"
        />
        <div className="method-visual-label">
          <span>Field note 01</span>
          <strong>Observe the day before designing the system.</strong>
        </div>
      </div>

      <div className="method-copy section-pad">
        <div className="section-marker">
          <span>03</span>
          <i />
          <span>How we work</span>
        </div>
        <p className="eyebrow eyebrow-dark">At the work · Not around it</p>
        <h2 id="method-title">We do not automate a process we have not understood.</h2>
        <p className="method-intro">
          The people closest to the work already know where it bends. We make that knowledge visible,
          then rebuild the conditions around it with them.
        </p>

        <ol className="method-steps">
          {methods.map((item, index) => (
            <motion.li
              key={item.number}
              initial={{ opacity: 0.25, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.55, margin: "-10% 0px -15% 0px" }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
            >
              <span>{item.number}</span>
              <div>
                <small>{item.verb}</small>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <ArrowDownRight size={24} weight="bold" />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
