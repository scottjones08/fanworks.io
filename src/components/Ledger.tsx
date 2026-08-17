import { useEffect, useRef, useState } from "react";
import { dayCards } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { FLOOR, FloorPlan, floorRooms } from "./FloorPlan";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function Ledger() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);

  const stacked = reduced;
  const card = dayCards[active];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const camera = cameraRef.current;
    const wrap = wrapRef.current;
    if (!section || !camera || !wrap) return;

    const path = camera.querySelector<SVGPathElement>("[data-line]");

    const update = () => {
      if (stacked) {
        camera.style.transform = "";
        if (path) path.style.strokeDashoffset = "0";
        setProgress(1);
        setActive(dayCards.length - 1);
        return;
      }

      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const raw = Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / distance));
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - (-2 * raw + 2) ** 2 / 2;
      const last = dayCards.length - 1;
      const span = eased * last;
      const index = Math.min(last, Math.floor(span + 0.001));
      const next = Math.min(last, index + 1);
      const local = span - index;
      const from = floorRooms[index];
      const to = floorRooms[next];
      const x = lerp(from.x + from.w / 2, to.x + to.w / 2, local);
      const y = lerp(from.y + from.h / 2, to.y + to.h / 2, local);
      const rw = lerp(from.w, to.w, local);
      const rh = lerp(from.h, to.h, local);

      const W = Math.max(1, wrap.clientWidth);
      const H = Math.max(1, wrap.clientHeight);
      const fit = Math.min(W / FLOOR.width, H / FLOOR.height);
      const mobile = window.innerWidth < 900;
      const pad = mobile ? 52 : 280;
      const fillZoom = Math.min(W / ((rw + pad) * fit), H / ((rh + pad) * fit));
      const zoom = mobile ? Math.min(4.2, Math.max(1.7, fillZoom * 0.92)) : Math.min(1.14, Math.max(1.02, 1.03 + eased * 0.05));
      const ox = (x - FLOOR.width / 2) * fit;
      const oy = (y - FLOOR.height / 2) * fit;
      const lift = mobile ? H * 0.16 : 0;
      camera.style.transform = `translate3d(${-ox * zoom}px, ${-oy * zoom - lift}px, 0) scale(${zoom})`;
      if (path) path.style.strokeDashoffset = String(1 - Math.max(0.08, eased));
      setProgress(raw);
      setActive(index);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [stacked]);

  return (
    <section
      className={`ledger${stacked ? " is-static" : ""}${narrow ? " is-narrow" : ""}`}
      id="ledger"
      ref={sectionRef}
      aria-labelledby="ledger-title"
    >
      <div className="ledger-stage">
        <div className="ledger-top">
          <div>
            <div className="section-kicker kicker-dark">
              <i />
              01 · A day on the floor
            </div>
            <h2 id="ledger-title">A typical day — before and after.</h2>
          </div>
          <span>Keep scrolling · rooms come to life</span>
        </div>

        <div className="ledger-main">
          <article
            className={`ledger-story${"finale" in card && card.finale ? " is-finale" : ""}`}
            key={card.zone}
            aria-live="polite"
          >
            <div className="ledger-story-meta">
              <span>{card.stamp}</span>
              <span>{card.room}</span>
              <span>{card.index}</span>
            </div>
            <p>{card.before}</p>
            <div className="ledger-rule" aria-hidden="true">
              <b />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <p className="ledger-after">{card.after}</p>
          </article>

          <div className="ledger-plan-wrap" ref={wrapRef}>
            <div className="ledger-plan-camera" ref={cameraRef}>
              <FloorPlan active={stacked ? dayCards.length - 1 : active} allLit={stacked} />
            </div>
            {narrow && !stacked ? (
              <svg className="ledger-minimap" viewBox="0 0 1520 860" aria-hidden="true">
                {floorRooms.map((room, index) => (
                  <rect
                    key={room.zone}
                    x={room.x}
                    y={room.y}
                    width={room.w}
                    height={room.h}
                    className={index === active ? "is-live" : index < active ? "is-visited" : ""}
                  />
                ))}
              </svg>
            ) : null}
          </div>
        </div>

        <div className="ledger-rail" aria-hidden="true">
          <div>
            <i style={{ width: `${progress * 100}%` }} />
            {dayCards.map((item, index) => (
              <span
                key={item.time}
                className={index <= active && (progress > 0.01 || index === 0) ? "is-on" : ""}
                style={{ left: `${(index / (dayCards.length - 1)) * 100}%` }}
              />
            ))}
          </div>
          <div>
            <span>7 AM</span>
            <span>{card.room}</span>
            <span>6 PM</span>
          </div>
        </div>
      </div>

      {stacked ? (
        <ol className="ledger-static-list">
          {dayCards.map((item) => (
            <li key={item.stamp}>
              <span>
                {item.stamp} · {item.room}
              </span>
              <p>{item.before}</p>
              <strong>{item.after}</strong>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
