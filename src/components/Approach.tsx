import { principles } from "../content";

export function Approach() {
  return (
    <section className="approach" id="approach" aria-label="How we work">
      <article className="approach-panel approach-see">
        <div className="section-kicker kicker-dark">
          <i />
          03 · How we work · 1 of 3
        </div>
        <span className="approach-num">01</span>
        <h2>{principles[0].title}</h2>
        <p>{principles[0].body}</p>
        <svg className="approach-art" viewBox="0 0 420 320" aria-hidden="true">
          <path d="M20 90 C 110 88 150 66 188 106 C 220 140 202 174 172 162 C 142 150 158 108 208 128 C 252 146 310 108 400 118" fill="none" stroke="#171916" strokeWidth="2" opacity="0.4" />
          <circle cx="190" cy="134" r="64" fill="none" stroke="#173c2e" strokeWidth="3.5" />
          <path d="M236 180 L 286 230" stroke="#173c2e" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </article>

      <article className="approach-panel approach-fix">
        <div className="section-kicker">
          <i />
          03 · How we work · 2 of 3
        </div>
        <span className="approach-num">02</span>
        <h2>{principles[1].title}</h2>
        <p>{principles[1].body}</p>
        <svg className="approach-art" viewBox="0 0 420 320" aria-hidden="true">
          <path d="M40 280 H 390" stroke="rgba(242,238,228,0.4)" strokeWidth="2" />
          <rect x="60" y="190" width="42" height="90" fill="none" stroke="rgba(242,238,228,0.45)" strokeWidth="2" />
          <rect x="126" y="130" width="42" height="150" fill="none" stroke="rgba(242,238,228,0.45)" strokeWidth="2" />
          <rect x="192" y="60" width="42" height="220" fill="rgba(213,161,59,0.9)" />
          <rect x="258" y="160" width="42" height="120" fill="none" stroke="rgba(242,238,228,0.45)" strokeWidth="2" />
          <rect x="324" y="205" width="42" height="75" fill="none" stroke="rgba(242,238,228,0.45)" strokeWidth="2" />
        </svg>
      </article>

      <article className="approach-panel approach-leave">
        <div className="section-kicker">
          <i />
          03 · How we work · 3 of 3
        </div>
        <span className="approach-num">03</span>
        <h2>{principles[2].title}</h2>
        <p>{principles[2].body}</p>
        <svg className="approach-art" viewBox="0 0 420 320" aria-hidden="true">
          <g stroke="rgba(242,238,228,0.35)" strokeWidth="2" fill="none">
            <rect x="30" y="90" width="58" height="38" rx="3" />
            <rect x="70" y="170" width="58" height="38" rx="3" />
            <rect x="24" y="230" width="58" height="38" rx="3" />
            <path d="M88 109 L 99 189 M99 189 L 53 230" strokeDasharray="4 6" />
          </g>
          <path d="M160 165 H 226 M 214 151 L 230 165 L 214 179" stroke="#d5a13b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M262 165 H 396" stroke="#d5a13b" strokeWidth="3" fill="none" />
          <circle cx="262" cy="165" r="7" fill="#171916" stroke="#d5a13b" strokeWidth="2.5" />
          <circle cx="329" cy="165" r="7" fill="#171916" stroke="#d5a13b" strokeWidth="2.5" />
          <circle cx="396" cy="165" r="7" fill="#171916" stroke="#d5a13b" strokeWidth="2.5" />
        </svg>
      </article>
    </section>
  );
}
