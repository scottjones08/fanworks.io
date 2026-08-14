import { motion } from "motion/react";
import { principles } from "../content";
import { useMotionConfig } from "../motion";
import { Reveal } from "./Reveal";

export function Ethos() {
  const { fadeUp, stagger, reduced } = useMotionConfig();

  return (
    <section className="ethos-section" id="ethos" aria-labelledby="ethos-title">
      <Reveal className="section-mark section-mark-light">
        <span>02</span>
        <span>How we work</span>
      </Reveal>
      <Reveal>
        <h2 id="ethos-title">Start with the work.</h2>
      </Reveal>
      <motion.div
        className="principle-list"
        variants={stagger}
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {principles.map(([title, line], index) => (
          <motion.article variants={fadeUp} key={title} data-num={`0${index + 1}`}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{line}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
