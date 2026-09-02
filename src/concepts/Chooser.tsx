import type { CSSProperties } from "react";
import "./chooser.css";
import { concepts } from "../shared/concepts";
import { FanMark } from "../shared/Logo";

export default function Chooser() {
  return (
    <main className="chooser">
      <header className="chooser-head">
        <FanMark className="chooser-mark" />
        <p>fanworks.io · site redesign · three directions</p>
      </header>
      <h1>
        Same company. Same promise. <em>Three ways to say it.</em>
      </h1>
      <p className="chooser-lede">
        Each direction is a complete, working site with its own typography, palette, motion, and a signature interaction.
        Open one, scroll it end to end on a phone and a laptop, then use the switcher in the corner to compare.
      </p>
      <ol className="chooser-grid">
        {concepts.map((c) => (
          <li key={c.slug}>
            <a href={`/${c.slug}`} className="chooser-card" style={{ "--a": c.palette[0], "--b": c.palette[1], "--c": c.palette[2] } as CSSProperties}>
              <span className="chooser-swatch" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="chooser-num">{c.number}</span>
              <strong>{c.name}</strong>
              <span className="chooser-thesis">{c.thesis}</span>
              <span className="chooser-go">Open direction →</span>
            </a>
          </li>
        ))}
      </ol>
      <footer className="chooser-foot">
        <a href="/current">View the current site for comparison →</a>
      </footer>
    </main>
  );
}
