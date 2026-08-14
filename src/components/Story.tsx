import { useEffect, useRef, useState } from "react";
import { Factory, SearchCheck, TrendingUp } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const reduced = !!useReducedMotion();
  const [count, setCount] = useState(reduced ? value : 0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) {
      setCount(value);
      return;
    }

    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const duration = 1200;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, value]);

  return (
    <strong ref={ref}>
      {count}
      {suffix}
    </strong>
  );
}

export function Story() {
  return (
    <section className="story-section" id="story" aria-labelledby="story-title">
      <Reveal className="story-art" amount={0.15}>
        <img
          src="/fanworks-operator-proof-v2.webp"
          alt="Experienced operators reviewing performance and walking a connected service and manufacturing operation"
          decoding="async"
        />
      </Reveal>
      <div className="story-copy">
        <Reveal className="section-mark">
          <span>03</span>
          <span>Why FanWorks</span>
        </Reveal>
        <Reveal>
          <h2 id="story-title">We have run the work.</h2>
          <p>
            We have built teams, run production, owned the numbers, and lived with the systems after
            launch. We know what it takes to make the work actually work.
          </p>
        </Reveal>
        <Reveal className="proof-stats">
          <article>
            <CountUp value={20} suffix="+" />
            <span>Years improving operations</span>
          </article>
          <article>
            <Factory aria-hidden="true" />
            <span>Manufacturing expertise</span>
          </article>
          <article>
            <SearchCheck aria-hidden="true" />
            <span>We have run businesses—not just advised them</span>
          </article>
        </Reveal>
        <Reveal className="kpi-band">
          <div>
            <TrendingUp aria-hidden="true" />
            <span>What gets better</span>
          </div>
          <ul>
            <li>Cycle time</li>
            <li>Throughput</li>
            <li>Gross margin</li>
            <li>On-time delivery</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
