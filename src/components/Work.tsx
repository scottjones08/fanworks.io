import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { services } from "../content";
import { useMotionConfig } from "../motion";
import { Reveal } from "./Reveal";

export function Work() {
  const { fadeUp, stagger, reduced } = useMotionConfig();

  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <Reveal className="section-mark">
        <span>01</span>
        <span>What we do</span>
      </Reveal>
      <Reveal>
        <h2 id="work-title">Where we help.</h2>
      </Reveal>
      <Reveal className="work-intro">
        <p>For growing service businesses and founder-led manufacturers that have outgrown the way work gets done today.</p>
        <span>We make the day-to-day clearer, calmer, and easier to run.</span>
      </Reveal>

      <motion.div
        className="service-list"
        variants={stagger}
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        {services.map(({ number, name, line, icon: Icon }) => (
          <motion.article className="service-row" variants={fadeUp} key={name}>
            <span>{number}</span>
            <Icon aria-hidden="true" />
            <h3>{name}</h3>
            <p>{line}</p>
            <ArrowRight aria-hidden="true" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
