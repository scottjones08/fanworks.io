import { useEffect, useRef, useState } from "react";
import { kpis } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useReveal } from "../hooks/useReveal";

export function Story() {
  const reduced = useReducedMotion();
  const copyRef = useReveal<HTMLDivElement>();
  const statsRef = useReveal<HTMLDivElement>();
  const kpiRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(reduced ? 20 : 0);
  const [kpiOn, setKpiOn] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setCount(20);
      setKpiOn(true);
      return;
    }
    const countNode = countRef.current;
    const kpiNode = kpiRef.current;
    if (!countNode || !kpiNode) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === countNode) {
            const start = performance.now();
            const tick = (now: number) => {
              const progress = Math.min(1, (now - start) / 1200);
              setCount(Math.round(20 * (1 - (1 - progress) ** 3)));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(countNode);
          }
          if (entry.target === kpiNode) {
            setKpiOn(true);
            io.unobserve(kpiNode);
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(countNode);
    io.observe(kpiNode);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    const wrap = imgWrapRef.current;
    if (!wrap || reduced) return;
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const k = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
      wrap.style.transform = `translateY(${k * 26}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <section className="story" id="story" aria-labelledby="story-title">
      <div>
        <div className="reveal" ref={copyRef}>
          <div className="section-kicker">
            <i />
            07 · Why FanWorks
          </div>
          <h2 id="story-title">We have run the work.</h2>
          <p>
            Our team is industry executives and entrepreneurs — from founder-led companies to the
            Fortune 500 — who have built teams, run production, owned the numbers, and lived with
            the systems after launch.
          </p>
        </div>

        <div className="proof-stats reveal" ref={statsRef}>
          <article>
            <strong ref={countRef}>{count}+</strong>
            <span>Years improving operations</span>
          </article>
          <article>
            <b>Manufacturing expertise</b>
            <span>Plants, lines, and shop floors</span>
          </article>
          <article>
            <b>Operator-led</b>
            <span>Executives & entrepreneurs — startup to Fortune 500</span>
          </article>
        </div>

        <div className={`kpi-panel${kpiOn ? " is-on" : ""}`} ref={kpiRef}>
          <span>What gets better</span>
          {kpis.map((item) => (
            <div className="kpi-row" key={item.name}>
              <div>
                <span>{item.name}</span>
                <em>{item.delta}</em>
              </div>
              <div className="kpi-track">
                <i style={{ width: kpiOn ? `${item.width}%` : "0%" }} />
              </div>
            </div>
          ))}
          <small>Typical movement across recent engagements</small>
        </div>
      </div>

      <figure className="story-art">
        <div ref={imgWrapRef}>
          <img
            src="/fan-works-hero.webp"
            alt="A working session: quarterly financials, a hand-drawn map of how the work moves, and the operators who run it"
          />
        </div>
        <figcaption>At the table · Not in a deck</figcaption>
      </figure>
    </section>
  );
}
