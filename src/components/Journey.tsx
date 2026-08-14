import { CSSProperties, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { rooms, scrollToId } from "../content";
import { useJourney } from "../hooks/useJourney";
import { useMotionConfig } from "../motion";
import { CtaButton } from "./CtaButton";

export function Journey() {
  const journeyRef = useRef<HTMLElement>(null);
  const { activeRoom } = useJourney(journeyRef);
  const { reduced, cardTransition } = useMotionConfig();
  const room = activeRoom >= 0 ? rooms[activeRoom] : null;

  return (
    <section
      className="journey"
      id="top"
      ref={journeyRef}
      style={{ "--journey": reduced ? 1 : 0, "--px": "0px", "--py": "0px" } as CSSProperties}
      aria-label="Explore how FanWorks moves through an operation"
    >
      <div className="journey-stage">
        <div className="cutaway-world" aria-hidden="true">
          <img src="/fanworks-cutaway-panorama-v7.webp" alt="" />
          {rooms.map((item, index) => (
            <span
              className={`room-pin room-pin-${index + 1}${activeRoom === index ? " is-active" : ""}`}
              key={item.name}
            >
              <b>{item.number}</b>
              {item.name}
            </span>
          ))}
        </div>
        <div className="cutaway-vignette" aria-hidden="true" />
        <div className="cutaway-grade" aria-hidden="true" />
        <div className="cutaway-grain" aria-hidden="true" />
        <div className="cutaway-spotlight" aria-hidden="true" />

        <div className="cutaway-header">
          <span>Richmond, Virginia · Inside the operation</span>
          <span>{activeRoom < 0 ? "— —" : String(activeRoom + 1).padStart(2, "0")} / 04</span>
        </div>

        <div className="room-narrative" aria-live="polite">
          <AnimatePresence mode="wait">
            {room ? (
              <motion.article
                key={room.name}
                className="narrative-card"
                initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={cardTransition}
              >
                <span>
                  {room.number} · {room.name}
                </span>
                <h2>{room.title}</h2>
                <p>{room.body}</p>
                <em className="room-fixes">Fixes · {room.fixes}</em>
              </motion.article>
            ) : (
              <motion.article
                key="intro"
                className="narrative-card intro-card"
                initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={cardTransition}
              >
                <span>Business systems consulting</span>
                <h1>We fix disconnected systems.</h1>
                <p>
                  Tools that do not talk. Manual work in between. Follow the line through the
                  operation and watch the pieces connect.
                </p>
                <CtaButton className="hero-cta" onClick={() => scrollToId("engage")}>
                  Start a conversation
                </CtaButton>
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        <div className="journey-progress" aria-hidden="true">
          <i />
        </div>
        <p className={`cutaway-hint${activeRoom >= 0 ? " is-hidden" : ""}`}>
          Scroll to move through the business
        </p>
      </div>
    </section>
  );
}
