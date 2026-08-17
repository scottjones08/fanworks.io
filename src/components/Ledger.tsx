import { useEffect, useRef, useState } from "react";
import { dayCards } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { FLOOR, FloorPlan, floorRooms, roomCenter } from "./FloorPlan";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const VIEW_CX = 760;
const VIEW_CY = 390;

export function Ledger() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [overview, setOverview] = useState(true);
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
    const stage = stageRef.current;
    if (!section || !camera || !wrap) return;

    const path = camera.querySelector<SVGPathElement>("[data-line]");
    const traveler = camera.querySelector<SVGCircleElement>("[data-traveler]");

    const update = () => {
      if (stacked) {
        camera.style.transform = "";
        if (path) path.style.strokeDashoffset = "0";
        setProgress(1);
        setActive(dayCards.length - 1);
        setOverview(false);
        return;
      }

      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const raw = Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / distance));
      const intro = Math.min(1, raw / 0.08);
      const walk = Math.max(0, (raw - 0.08) / 0.92);
      const eased = walk < 0.5 ? 2 * walk * walk : 1 - (-2 * walk + 2) ** 2 / 2;
      const last = dayCards.length - 1;
      const span = eased * last;
      const index = Math.min(last, Math.floor(span + 0.001));
      const next = Math.min(last, index + 1);
      const local = span - index;
      const from = roomCenter(floorRooms[index]);
      const to = roomCenter(floorRooms[next]);
      const x = lerp(from.x, to.x, local);
      const y = lerp(from.y, to.y, local);
      const rw = lerp(floorRooms[index].w, floorRooms[next].w, local);
      const rh = lerp(floorRooms[index].h, floorRooms[next].h, local);

      const W = Math.max(1, wrap.clientWidth);
      const H = Math.max(1, wrap.clientHeight);
      const fit = Math.min(W / FLOOR.width, H / FLOOR.height);
      const mobile = window.innerWidth < 900;
      const seeingAll = raw < 0.08;
      const pad = mobile ? 70 : 280;
      const fillZoom = Math.min(W / ((rw + pad) * fit), H / ((rh + pad) * fit));
      const zoom = mobile
        ? seeingAll
          ? 1.18
          : Math.min(2.35, Math.max(1.35, fillZoom * 0.9))
        : 1.14 + eased * 0.08;
      const lookT = mobile ? (seeingAll ? 0.08 : 1) : 0.08 + eased * 0.18;
      const ox = (x - VIEW_CX) * fit * lookT;
      const oy = (y - VIEW_CY) * fit * lookT;
      const lift = mobile ? (seeingAll ? H * 0.08 : H * 0.12) : 0;
      camera.style.transform = `translate3d(${-ox * zoom}px, ${-oy * zoom - lift}px, 0) rotateX(12deg) rotateZ(-8deg) scale(${zoom})`;
      if (stage) stage.style.setProperty("--day", String(Math.max(intro * 0.2, eased)));
      if (path) {
        path.style.strokeDashoffset = String(1 - Math.max(0.12, seeingAll ? 0.12 : eased));
        if (traveler) {
          try {
            const len = path.getTotalLength();
            const pt = path.getPointAtLength(Math.max(0.04, seeingAll ? 0.04 : eased) * len);
            traveler.setAttribute("cx", String(pt.x));
            traveler.setAttribute("cy", String(pt.y));
          } catch {
            /* path not ready */
          }
        }
      }
      setProgress(raw);
      setActive(seeingAll ? 0 : index);
      setOverview(seeingAll);
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
      className={`ledger${stacked ? " is-static" : ""}${narrow ? " is-narrow" : ""}${overview && !stacked ? " is-overview" : ""}`}
      id="ledger"
      ref={sectionRef}
      aria-labelledby="ledger-title"
    >
      <div className="ledger-stage" ref={stageRef}>
        <div className="ledger-top">
          <div>
            <div className="section-kicker kicker-dark">
              <i />
              01 · A day on the floor
            </div>
            <h2 id="ledger-title">One line through the building.</h2>
          </div>
          <span>Six stations · 7 AM to 6 PM</span>
        </div>

        <div className="ledger-main">
          <article
            className={`ledger-story${overview ? " is-overview" : ""}${"finale" in card && card.finale && !overview ? " is-finale" : ""}`}
            key={overview ? "overview" : card.zone}
            aria-live="polite"
          >
            {overview ? (
              <>
                <div className="ledger-story-meta">
                  <span>The line of work</span>
                  <span>Six stations</span>
                </div>
                <p>Six rooms around one aisle. A job should move through the building in one direction — not bounce between inboxes.</p>
                <p className="ledger-after">Scroll to walk it.</p>
              </>
            ) : (
              <>
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
              </>
            )}
          </article>

          <div className="ledger-plan-wrap" ref={wrapRef}>
            <div className="ledger-plan-camera" ref={cameraRef}>
              <FloorPlan
                active={stacked ? dayCards.length - 1 : active}
                allLit={stacked}
                overview={overview && !stacked}
              />
            </div>
            {narrow && !stacked ? (
              <svg className="ledger-minimap" viewBox="0 0 840 492" aria-hidden="true">
                {floorRooms.map((room, index) => (
                  <rect
                    key={room.zone}
                    x={room.x}
                    y={room.y}
                    width={room.w}
                    height={room.h}
                    className={!overview && index === active ? "is-live" : !overview && index < active ? "is-visited" : ""}
                  />
                ))}
                <rect className="ledger-minimap-aisle" x="0" y="200" width="840" height="92" />
              </svg>
            ) : null}
          </div>
        </div>

        <div className="ledger-rail" aria-hidden="true">
          <ol className="ledger-stops">
            {dayCards.map((item, index) => (
              <li
                key={item.time}
                className={
                  overview
                    ? ""
                    : index === active
                      ? "is-on is-live"
                      : index < active
                        ? "is-on"
                        : ""
                }
              >
                <b>{item.time}</b>
                <span>{item.room}</span>
              </li>
            ))}
          </ol>
          <div className="ledger-meter">
            <i style={{ width: `${progress * 100}%` }} />
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
