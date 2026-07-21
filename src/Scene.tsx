import { CSSProperties } from "react";

/*
 * The alley scene. One SVG, camera behind the walker, vanishing point at
 * (720, 360) in a 1440x900 viewBox. Everything scroll-driven reads the --p
 * custom property (0 = home/dark, 1 = opportunity/bright) set on .journey.
 * Elements appear via the .tl utility: --t is each element's progress
 * threshold; .fade/.grow map the resulting --v onto opacity/transform.
 */

const at = (t: number): CSSProperties => ({ "--t": t } as CSSProperties);

const GROUND_TOP = 385;
const GROUND_BOTTOM = 900;
const xLeft = (y: number) => 150 + (510 * (GROUND_BOTTOM - y)) / (GROUND_BOTTOM - GROUND_TOP);
const xRight = (y: number) => 1290 - (510 * (GROUND_BOTTOM - y)) / (GROUND_BOTTOM - GROUND_TOP);

const COBBLE_ROWS = [
  { y: 372, rx: 6, ry: 2.5 },
  { y: 384, rx: 7, ry: 3 },
  { y: 398, rx: 8, ry: 3.5 },
  { y: 414, rx: 9.5, ry: 4 },
  { y: 433, rx: 11.5, ry: 5 },
  { y: 456, rx: 14, ry: 6 },
  { y: 484, rx: 17, ry: 7 },
  { y: 518, rx: 20, ry: 8.5 },
  { y: 560, rx: 24, ry: 10 },
  { y: 612, rx: 29, ry: 12 },
  { y: 676, rx: 34, ry: 14.5 },
  { y: 754, rx: 40, ry: 17 },
  { y: 848, rx: 47, ry: 20 },
];

function Cobbles() {
  return (
    <g className="cobbles">
      {COBBLE_ROWS.map(({ y, rx, ry }, ri) => {
        const xa = xLeft(y) + rx;
        const xb = xRight(y) - rx;
        const n = Math.max(3, Math.floor((xb - xa) / (rx * 2.3)));
        const step = (xb - xa) / Math.max(1, n - 1);
        return Array.from({ length: n }, (_, i) => {
          const jitter = (((i * 37 + ri * 53) % 9) - 4) * (rx / 20);
          return (
            <ellipse
              key={`${ri}-${i}`}
              cx={xa + i * step + jitter}
              cy={y}
              rx={rx}
              ry={ry}
              fill="#24261f"
              stroke="rgba(245, 241, 230, 0.06)"
              strokeWidth="1"
            />
          );
        });
      })}
    </g>
  );
}

function Flora({ x, y, s = 1, t }: { x: number; y: number; s?: number; t: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="tl fade grow" style={at(t)}>
        <path d="M-14,2 Q-18,-6 -12,-10 Q-4,-8 -2,0 Z" fill="#2c5040" />
        <path d="M14,2 Q19,-5 13,-11 Q5,-8 3,0 Z" fill="#2c5040" />
        <path d="M0,0 C-2,-12 -5,-20 -9,-28" className="stem" />
        <path d="M0,0 C1,-14 1,-24 2,-34" className="stem" />
        <path d="M0,0 C3,-10 7,-16 11,-24" className="stem" />
        <ellipse cx="-6" cy="-14" rx="6" ry="2.8" transform="rotate(-32 -6 -14)" fill="#35604a" />
        <ellipse cx="7" cy="-12" rx="5.5" ry="2.6" transform="rotate(26 7 -12)" fill="#35604a" />
        <circle cx="-9" cy="-30" r="5.5" fill="#a63a2a" />
        <circle cx="2" cy="-36" r="6" fill="#c9705e" />
        <circle cx="11" cy="-26" r="5" fill="#d5a13b" />
        <circle cx="-9" cy="-30" r="2" fill="#6f211a" />
        <circle cx="2" cy="-36" r="2.2" fill="#96482f" />
        <circle cx="11" cy="-26" r="1.8" fill="#8a6220" />
      </g>
    </g>
  );
}

function WindowBox({ x, y, w, t }: { x: number; y: number; w: number; t: number }) {
  const n = Math.max(3, Math.round(w / 22));
  const step = w / (n - 1);
  const colors = ["#a63a2a", "#d5a13b", "#c9705e"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="tl fade grow" style={at(t)}>
        <rect x={-6} y={-2} width={w + 12} height={10} fill="#20221b" stroke="rgba(245,241,230,0.12)" />
        {Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <path d={`M${i * step},-2 C${i * step - 2},-8 ${i * step - 1},-12 ${i * step},-15`} className="stem" />
            <circle cx={i * step} cy={-16} r={4.5} fill={colors[i % 3]} />
          </g>
        ))}
      </g>
    </g>
  );
}

function Win({ pts, t, mullion }: { pts: string; t: number; mullion?: string }) {
  return (
    <g>
      <polygon points={pts} fill="none" stroke="rgba(245, 241, 230, 0.13)" strokeWidth="1.5" />
      <g className="tl" style={at(t)}>
        <polygon points={pts} fill="url(#winGrad)" filter="url(#soft)" className="fade-half" />
        <polygon points={pts} fill="url(#winGrad)" className="fade" />
        {mullion ? <path d={mullion} stroke="rgba(27, 29, 25, 0.55)" strokeWidth="2.5" fill="none" className="fade" /> : null}
      </g>
    </g>
  );
}

function Keeper({ x, y, s, t }: { x: number; y: number; s: number; t: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="tl fade rise" style={at(t)}>
        <circle cx="0" cy="-64" r="7.5" fill="#191b16" />
        <path d="M-9,-56 C-11,-34 -10,-14 -7,0 L7,0 C10,-16 11,-36 9,-56 C4,-61 -4,-61 -9,-56 Z" fill="#191b16" />
        <path d="M-8,-50 C-14,-44 -18,-38 -21,-31 L-16,-28 C-13,-36 -10,-42 -6,-46 Z" fill="#191b16" />
        <path d="M-32,-31 h11 v9 h-11 Z M-32,-27 l-7,-5 v4 l7,5 Z" fill="#191b16" />
      </g>
    </g>
  );
}

function Ahead({ x, y, s, t }: { x: number; y: number; s: number; t: number }) {
  const fig = (dx: number, h: number, key: string) => (
    <g key={key} transform={`translate(${dx} 0) scale(${h / 70})`}>
      <circle cx="0" cy="-64" r="7" fill="#1d1f19" />
      <path d="M-8,-56 C-9,-36 -8,-20 -6,-12 L6,-12 C8,-22 9,-38 8,-56 C3,-61 -3,-61 -8,-56 Z" fill="#1d1f19" />
      <path d="M-5,-12 L-8,0 L-4,0 L-1,-12 Z" fill="#1d1f19" />
      <path d="M1,-12 L5,-2 L9,-2 L6,-12 Z" fill="#1d1f19" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="tl fade rise" style={at(t)}>
        {fig(-16, 66, "a")}
        {fig(14, 72, "b")}
      </g>
    </g>
  );
}

export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="sky sky-night" />
      <div className="sky sky-dawn" />
      <div className="sky sky-day" />
      <div className="sky-glow" />

      <svg
        className="scene-art"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="winGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0c979" />
            <stop offset="1" stopColor="#c98f37" />
          </linearGradient>
          <linearGradient id="shaftGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(224, 172, 74, 0.75)" />
            <stop offset="1" stopColor="rgba(224, 172, 74, 0)" />
          </linearGradient>
          <radialGradient id="lampGlow">
            <stop offset="0" stopColor="rgba(224, 172, 74, 0.85)" />
            <stop offset="1" stopColor="rgba(224, 172, 74, 0)" />
          </radialGradient>
          <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <clipPath id="groundClip">
            <polygon points="150,900 660,385 780,385 1290,900" />
          </clipPath>
        </defs>

        {/* night sky details */}
        <g className="stars">
          <circle cx="300" cy="120" r="1.6" fill="#f5f1e6" />
          <circle cx="520" cy="72" r="1.2" fill="#f5f1e6" />
          <circle cx="836" cy="58" r="1.4" fill="#f5f1e6" />
          <circle cx="1002" cy="132" r="1.2" fill="#f5f1e6" />
          <circle cx="1176" cy="88" r="1.6" fill="#f5f1e6" />
        </g>

        {/* walls */}
        <polygon points="0,80 660,240 660,385 150,900 0,900" fill="#171913" />
        <polygon points="1440,80 780,240 780,385 1290,900 1440,900" fill="#131510" />
        <polygon points="0,80 660,240 660,385 150,900 0,900" fill="#f3e3bd" className="wash-soft" />
        <polygon points="1440,80 780,240 780,385 1290,900 1440,900" fill="#f3e3bd" className="wash-soft" />
        <polygon points="0,80 660,240 660,385 150,900 0,900" fill="#efdcae" className="wash-thin" />
        <polygon points="1440,80 780,240 780,385 1290,900 1440,900" fill="#efdcae" className="wash-thin" />
        <path d="M0,80 L660,240" stroke="rgba(245, 241, 230, 0.14)" strokeWidth="2" fill="none" />
        <path d="M1440,80 L780,240" stroke="rgba(245, 241, 230, 0.14)" strokeWidth="2" fill="none" />

        {/* the opening at the end of the alley: skyline of opportunity */}
        <g>
          <polygon
            points="660,385 660,350 674,350 674,338 688,338 688,346 702,346 702,330 716,330 716,342 733,342 733,326 748,326 748,340 762,340 762,334 780,334 780,385"
            fill="#0e100c"
          />
          <polygon
            points="660,385 660,350 674,350 674,338 688,338 688,346 702,346 702,330 716,330 716,342 733,342 733,326 748,326 748,340 762,340 762,334 780,334 780,385"
            fill="#d9b878"
            className="wash-strong"
          />
        </g>

        {/* windows: lights come on one by one as the walk progresses */}
        <Win pts="560,470 600,458 600,395 560,402" t={0.16} />
        <Win pts="880,470 840,458 840,395 880,402" t={0.3} />
        <Win pts="430,540 490,520 490,420 430,432" t={0.36} />
        <Win pts="1010,540 950,520 950,420 1010,432" t={0.52} />
        <Win
          pts="250,640 340,610 340,470 250,480"
          t={0.62}
          mullion="M295,625 L295,475 M250,560 L340,540"
        />

        {/* lamp on the left wall — the first light of the walk */}
        <g>
          <path d="M652,404 l-14,-6 v4 l14,6 Z" fill="#101210" />
          <rect x="630" y="392" width="11" height="15" fill="#101210" stroke="rgba(224, 172, 74, 0.5)" strokeWidth="1.5" />
          <circle cx="635.5" cy="399.5" r="3.2" fill="#e8b45a" />
          <circle cx="635.5" cy="399.5" r="24" fill="url(#lampGlow)" className="lamp-glow" />
        </g>

        {/* doorway with light spilling out (desktop framing) */}
        <g className="d-only">
          <polygon points="1060,745 1130,718 1130,566 1060,584" fill="#15170f" stroke="rgba(245, 241, 230, 0.13)" strokeWidth="1.5" />
          <g className="tl" style={at(0.5)}>
            <polygon points="1066,738 1124,715 1124,574 1066,590" fill="url(#winGrad)" className="fade-half" filter="url(#soft)" />
            <polygon points="1066,738 1124,715 1124,574 1066,590" fill="url(#winGrad)" className="fade" />
          </g>
        </g>

        {/* ground */}
        <g clipPath="url(#groundClip)">
          <polygon points="150,900 660,385 780,385 1290,900" fill="#1a1c16" />
          <Cobbles />
          <polygon points="150,900 660,385 780,385 1290,900" fill="#eed9a8" className="wash-soft" />
          <polygon points="150,900 660,385 780,385 1290,900" fill="#e9d3a0" className="wash-thin" />
        </g>

        {/* light pooling and flooding out of the opening */}
        <ellipse cx="720" cy="392" rx="64" ry="10" fill="#e0ac4a" className="tl fade-half" style={at(0.5)} />
        <polygon points="660,385 780,385 1080,900 360,900" fill="url(#shaftGrad)" className="shaft" />

        {/* flowers along the walk */}
        <Flora x={505} y={600} s={0.55} t={0.3} />
        <WindowBox x={252} y={648} w={86} t={0.48} />
        <g className="d-only">
          <Flora x={235} y={838} s={1.05} t={0.58} />
          <Flora x={286} y={846} s={0.8} t={0.62} />
          <Flora x={1205} y={850} s={1.1} t={0.68} />
          <Flora x={1152} y={842} s={0.85} t={0.72} />
        </g>
        <g className="m-only">
          <Flora x={520} y={800} s={0.9} t={0.5} />
          <Flora x={915} y={820} s={0.95} t={0.62} />
        </g>
        <Flora x={665} y={420} s={0.32} t={0.76} />
        <Flora x={782} y={424} s={0.34} t={0.78} />

        {/* people along the walk */}
        <g className="d-only">
          <Keeper x={1093} y={742} s={1.9} t={0.55} />
        </g>
        <g className="m-only">
          <Keeper x={898} y={565} s={1.05} t={0.55} />
        </g>
        <Ahead x={714} y={452} s={0.78} t={0.74} />

        {/* birds, once the sky is bright */}
        <g className="tl fade" style={at(0.8)}>
          <path d="M612,178 Q616,173 620,178 Q624,173 628,178" stroke="#3a3c34" strokeWidth="2" fill="none" />
          <path d="M700,148 Q704,143 708,148 Q712,143 716,148" stroke="#3a3c34" strokeWidth="2" fill="none" />
        </g>

        {/* the walker: camera stays behind the subject */}
        <g transform="translate(720 872)">
          <ellipse cx="0" cy="10" rx="58" ry="12" fill="#0d0f0b" className="walker-shadow" />
          <g className="walker-bob">
            <path d="M30,-244 Q41,-170 30,-100" stroke="#e0ac4a" strokeWidth="3" fill="none" className="walker-rim" />
            <path d="M-22,-100 L-14,-8 L2,-8 L-4,-100 Z" fill="#14150f" />
            <path d="M6,-100 L18,-22 L34,-16 L22,-100 Z" fill="#14150f" />
            <ellipse cx="-6" cy="-6" rx="14" ry="6" fill="#14150f" />
            <ellipse cx="28" cy="-16" rx="13" ry="6" transform="rotate(-16 28 -16)" fill="#14150f" />
            <path d="M-36,-240 Q-46,-160 -30,-96 L30,-96 Q46,-160 36,-240 Q0,-260 -36,-240 Z" fill="#14150f" />
            <path d="M-36,-232 Q-54,-178 -44,-136 Q-39,-130 -33,-135 Q-43,-178 -29,-226 Z" fill="#14150f" />
            <path d="M36,-232 Q55,-174 43,-130 Q38,-124 32,-130 Q42,-176 28,-226 Z" fill="#14150f" />
            <rect x="-11" y="-252" width="22" height="14" fill="#14150f" />
            <circle cx="0" cy="-268" r="25" fill="#14150f" />
          </g>
        </g>
      </svg>

      <div className="vignette" />
    </div>
  );
}
