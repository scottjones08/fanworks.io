import { FormEvent, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Cable,
  Coffee,
  Compass,
  HeartHandshake,
  Landmark,
  MapPin,
  Menu,
  SearchCheck,
  ShoppingBag,
  Workflow,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ServiceId = "assess" | "concierge" | "integrate" | "automate";

type Service = {
  id: ServiceId;
  eyebrow: string;
  title: string;
  summary: string;
  detail: string;
  outcome: string;
  icon: LucideIcon;
};

const services: Service[] = [
  {
    id: "assess",
    eyebrow: "01 / Assess",
    title: "See the business clearly.",
    summary: "A practical assessment of the work, the tools, and where AI may or may not help.",
    detail:
      "We listen to the people doing the work, trace the real process, and separate the useful opportunities from the noise.",
    outcome: "A plain-language view of what to keep, fix, stop, and explore next.",
    icon: SearchCheck,
  },
  {
    id: "concierge",
    eyebrow: "02 / Guide",
    title: "Keep the work moving.",
    summary: "Hands-on business concierge support for decisions that do not fit neatly into a ticket.",
    detail:
      "We stay close to the day-to-day, connect the right people, and help carry important work from question to decision.",
    outcome: "Steady progress without adding another layer of management overhead.",
    icon: Compass,
  },
  {
    id: "integrate",
    eyebrow: "03 / Integrate",
    title: "Make the tools belong.",
    summary: "Technology integration shaped around the business instead of forcing the business around software.",
    detail:
      "We connect systems, information, and handoffs while protecting the judgment and relationships that make the business work.",
    outcome: "A simpler operating environment that people can understand and use.",
    icon: Cable,
  },
  {
    id: "automate",
    eyebrow: "04 / Automate",
    title: "Take repetition off the team.",
    summary: "Practical automation for the repeatable work, with people still in control of the meaningful decisions.",
    detail:
      "We automate the right steps, build in human review where it matters, and leave the team with a system they can own.",
    outcome: "More room for judgment, service, craft, and the work only people can do.",
    icon: Workflow,
  },
];

const sectors = [
  { label: "Retail & hospitality", icon: ShoppingBag },
  { label: "Financial services", icon: Landmark },
  { label: "Professional services", icon: BriefcaseBusiness },
  { label: "Community organizations", icon: HeartHandshake },
  { label: "Makers & local business", icon: Coffee },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function App() {
  const [activeService, setActiveService] = useState<ServiceId>("assess");
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.25 });
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(heroScroll, [0, 1], [0, reduceMotion ? 0 : 80]);

  const selectedService = services.find((service) => service.id === activeService) ?? services[0];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const business = String(form.get("business") || "");
    const message = String(form.get("message") || "");
    const subject = encodeURIComponent(`FanWorks conversation: ${business || name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nBusiness: ${business}\nEmail: ${form.get("email") || ""}`);
    setSubmitted(true);
    window.location.href = `mailto:hello@fanworks.io?subject=${subject}&body=${body}`;
  };

  return (
    <main>
      <motion.div className="scroll-progress" style={{ scaleX: smoothProgress }} aria-hidden="true" />

      <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
        <header className="site-header">
          <button className="brand-lockup" type="button" onClick={() => scrollTo("top")} aria-label="FanWorks home">
            <span className="wordmark">FanWorks</span>
            <span className="brand-subtitle">Human-centered consulting</span>
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <button type="button" onClick={() => scrollTo("services")}>Services</button>
            <button type="button" onClick={() => scrollTo("approach")}>Approach</button>
            <button type="button" onClick={() => scrollTo("story")}>Our story</button>
            <button className="nav-cta" type="button" onClick={() => scrollTo("engage")}>Talk to us</button>
          </nav>

          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <button type="button" onClick={() => scrollTo("services")}>Services</button>
              <button type="button" onClick={() => scrollTo("approach")}>Approach</button>
              <button type="button" onClick={() => scrollTo("story")}>Our story</button>
              <button type="button" onClick={() => scrollTo("engage")}>Talk to us</button>
            </motion.nav>
          ) : null}
        </AnimatePresence>

        <motion.div
          className="hero-image"
          style={{ y: imageY }}
          initial={reduceMotion ? false : { clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
        <div className="hero-paper" aria-hidden="true" />

        <div className="hero-content">
          <motion.p
            className="origin-line"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            <MapPin aria-hidden="true" />
            Born in The Fan, Richmond, Virginia
          </motion.p>

          <motion.h1
            id="hero-title"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ delay: 0.38, duration: 0.85 }}
          >
            <span>Make technology</span>
            <span>feel like it <em>belongs.</em></span>
          </motion.h1>

          <motion.div
            className="hero-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.85, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ delay: 0.58, duration: 0.8 }}
          >
            <p>
              FanWorks helps owners make sense of the work, choose the right technology, and put it in place without losing
              what makes the business human.
            </p>
            <p className="service-sentence">
              Business and AI assessments. Hands-on concierge support. Thoughtful integration. Practical automation.
            </p>
          </motion.div>

          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ delay: 0.72, duration: 0.8 }}
          >
            <button className="button button-primary" type="button" onClick={() => scrollTo("engage")}>
              Tell us what feels complicated <ArrowRight aria-hidden="true" />
            </button>
            <button className="button button-secondary" type="button" onClick={() => scrollTo("approach")}>
              See our approach
            </button>
          </motion.div>
        </div>

        <motion.div
          className="sector-rail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {sectors.map(({ label, icon: Icon }) => (
            <div className="sector" key={label}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        <button className="scroll-cue" type="button" onClick={() => scrollTo("services")} aria-label="Continue to services">
          <span>Keep going</span>
          <ArrowDown aria-hidden="true" />
        </button>
      </section>

      <section className="services-section" id="services" aria-labelledby="services-title">
        <motion.div
          className="section-heading services-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={reveal}
          transition={{ duration: 0.75 }}
        >
          <p className="eyebrow">Here is how</p>
          <h2 id="services-title">Four ways we help the work <em>move.</em></h2>
          <p>We meet the business where it is and stay close enough to make the next step useful.</p>
        </motion.div>

        <div className="service-explorer">
          <div className="service-tabs" role="tablist" aria-label="FanWorks services">
            {services.map((service) => {
              const Icon = service.icon;
              const selected = service.id === activeService;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="service-detail"
                  className={selected ? "service-tab is-active" : "service-tab"}
                  onClick={() => setActiveService(service.id)}
                >
                  <Icon aria-hidden="true" />
                  <span>{service.eyebrow}</span>
                  <strong>{service.title}</strong>
                  <ArrowRight aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              id="service-detail"
              role="tabpanel"
              className="service-detail"
              key={selectedService.id}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="detail-number">{selectedService.eyebrow}</p>
              <h3>{selectedService.summary}</h3>
              <p>{selectedService.detail}</p>
              <div className="detail-outcome">
                <span>What you leave with</span>
                <p>{selectedService.outcome}</p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      <section className="approach-section" id="approach" aria-labelledby="approach-title">
        <div className="approach-intro">
          <motion.p className="eyebrow" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            Our approach
          </motion.p>
          <motion.h2 id="approach-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            We look before we reach for tools.
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            The useful answer is rarely “more software.” We begin with the people, decisions, and routines already carrying
            the business, then shape the technology around them.
          </motion.p>
        </div>

        <div className="approach-steps">
          {[
            ["01", "Listen in context", "We talk with the people closest to the work and see how it actually moves."],
            ["02", "Name what matters", "We surface the friction, the useful signals, and the human moments worth protecting."],
            ["03", "Build the right amount", "We integrate or automate only what earns its place in the business."],
            ["04", "Leave capability behind", "We document the system, teach the team, and make ownership clear."],
          ].map(([number, title, body], index) => (
            <motion.article
              className="approach-step"
              key={number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.1, duration: 0.65 }}
            >
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="story-section" id="story" aria-labelledby="story-title">
        <motion.div
          className="story-image"
          initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
        <motion.div
          className="story-copy"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow">The neighborhood behind the name</p>
          <h2 id="story-title">Built in The Fan. Shaped by small business.</h2>
          <p>
            The Fan is a neighborhood of old brick, new ideas, and people who know one another by the work they do. Behind
            its doors are retailers, advisers, makers, operators, and entrepreneurs building businesses at every scale.
          </p>
          <p>
            FanWorks carries that same spirit into consulting: practical expertise shared across the block, different
            disciplines meeting around a real problem, and technology that strengthens the connection instead of replacing it.
          </p>
          <blockquote>Surfacing clarity in complex environments, with the human still at the center.</blockquote>
        </motion.div>
      </section>

      <section className="engage-section" id="engage" aria-labelledby="engage-title">
        <div className="engage-copy">
          <p className="eyebrow">Start with the real thing</p>
          <h2 id="engage-title">Tell us what feels complicated.</h2>
          <p>
            Bring us a tangled process, a technology decision, an overloaded team, or an idea that needs a practical path.
            We will start by understanding it.
          </p>
          <a href="mailto:hello@fanworks.io">hello@fanworks.io</a>
          <span>Richmond, Virginia</span>
        </div>

        <motion.form
          className="contact-form"
          onSubmit={submitContact}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <div className="form-row">
            <label>
              <span>Your name</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>
          <label>
            <span>Business or organization</span>
            <input name="business" autoComplete="organization" />
          </label>
          <label>
            <span>What should we understand?</span>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="A process, a decision, a team constraint, or simply where the work is getting heavy."
            />
          </label>
          <div className="form-footer">
            <button className="button button-light" type="submit">
              Start the conversation <ArrowRight aria-hidden="true" />
            </button>
            <p role="status">
              {submitted ? "Your email app should open with this note ready to send." : "No pitch deck required. A few honest sentences are enough."}
            </p>
          </div>
        </motion.form>
      </section>

      <footer className="site-footer">
        <div className="brand-lockup footer-brand">
          <span className="wordmark">FanWorks</span>
          <span className="brand-subtitle">Human-centered consulting</span>
        </div>
        <p>Business clarity, technology integration, and automation built around people.</p>
        <span>Richmond, Virginia · Est. 2025</span>
      </footer>
    </main>
  );
}
