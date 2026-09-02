import type { CSSProperties } from "react";

/**
 * Drawn covers for stories and sectors: one line, a few marks, ink on the
 * card's tint. Each story gets its own diagram; each sector gets its own
 * line through its stations. A light turbulence filter gives the strokes a
 * hand-drawn edge.
 */

const INK = "rgba(255,255,255,0.92)";
const DIM = "rgba(255,255,255,0.35)";
const FAINT = "rgba(255,255,255,0.14)";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`ink-${id}`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
        <stop offset="1" stopColor="rgba(0,0,0,0.35)" />
      </linearGradient>
    </defs>
  );
}

const stroke = { fill: "none", stroke: INK, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const thin = { ...stroke, stroke: DIM, strokeWidth: 1.2 };

/** A gently wandering line through evenly spaced points. */
function wander(points: [number, number][]) {
  return points
    .map(([x, y], i, a) => {
      if (i === 0) return `M ${x} ${y}`;
      const [px, py] = a[i - 1];
      const mx = (px + x) / 2;
      return `C ${mx} ${py - 10}, ${mx} ${y + 10}, ${x} ${y}`;
    })
    .join(" ");
}

const grid = (w: number, h: number, step = 20) => (
  <g stroke={FAINT} strokeWidth="1">
    {Array.from({ length: Math.floor(w / step) }, (_, i) => (
      <line key={`v${i}`} x1={(i + 1) * step} y1="0" x2={(i + 1) * step} y2={h} />
    ))}
    {Array.from({ length: Math.floor(h / step) }, (_, i) => (
      <line key={`h${i}`} x1="0" y1={(i + 1) * step} x2={w} y2={(i + 1) * step} />
    ))}
  </g>
);

const art: Record<string, () => JSX.Element> = {
  // one client record with its rings
  "wealth-os": () => (
    <g>
      <circle cx="200" cy="88" r="10" fill={INK} />
      {[28, 48, 68].map((r) => (
        <circle key={r} cx="200" cy="88" r={r} {...thin} strokeDasharray={r === 48 ? "4 6" : undefined} />
      ))}
      {[["plan", -60, -40], ["service", 62, -38], ["documents", -78, 28], ["compliance", 74, 30], ["review", 0, 78]].map(([t, dx, dy]) => (
        <g key={String(t)}>
          <line x1="200" y1="88" x2={200 + Number(dx) * 0.8} y2={88 + Number(dy) * 0.8} {...stroke} />
          <circle cx={200 + Number(dx)} cy={88 + Number(dy)} r="4" fill={INK} />
        </g>
      ))}
      <path d="M 40 150 C 120 120, 160 118, 196 100" {...stroke} />
    </g>
  ),
  // intake queue to a matter timeline with deadline flags
  "legal-platform": () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="36" y={34 + i * 22} width="70" height="12" rx="2" {...thin} />
      ))}
      <path d="M 110 60 C 150 60, 150 96, 190 96 L 360 96" {...stroke} />
      {[210, 250, 290, 330].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="96" r="5" fill={i === 2 ? "none" : INK} stroke={INK} strokeWidth="2" />
          <line x1={x} y1="96" x2={x} y2={i % 2 ? 122 : 70} {...thin} />
          <path d={`M ${x} ${i % 2 ? 122 : 62} l 14 5 l -14 5`} fill={INK} stroke="none" />
        </g>
      ))}
    </g>
  ),
  // many locations, one report
  "health-reporting": () => (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={40 + (i % 3) * 46} y={30 + Math.floor(i / 3) * 40} width="34" height="26" rx="3" {...thin} />
      ))}
      <path d="M 178 58 C 220 58, 220 90, 262 90" {...stroke} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={262 + i * 20} y={140 - [46, 70, 58, 92, 80][i]} width="12" height={[46, 70, 58, 92, 80][i]} fill={INK} opacity={i === 3 ? 1 : 0.55} />
      ))}
      <line x1="256" y1="140" x2="368" y2="140" {...stroke} />
    </g>
  ),
  // a mess becomes a queue with a decision
  "property-intake": () => (
    <g>
      {[[44, 40, -14], [72, 92, 12], [56, 120, -6], [100, 52, 22], [120, 110, -18]].map(([x, y, r], i) => (
        <rect key={i} x={x} y={y} width="34" height="24" rx="2" transform={`rotate(${r} ${Number(x) + 17} ${Number(y) + 12})`} {...thin} />
      ))}
      <path d="M 160 88 C 200 88, 200 60, 236 60" {...stroke} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="236" y={40 + i * 26} width="110" height="16" rx="3" {...(i === 1 ? stroke : thin)} />
          {i === 1 ? <path d="M 322 50 l 5 5 l 9 -11" {...stroke} /> : null}
        </g>
      ))}
    </g>
  ),
  // a graph of what the company knows, inside a box it owns
  "company-memory": () => (
    <g>
      <rect x="40" y="26" width="320" height="124" rx="10" {...stroke} strokeDasharray="6 8" />
      {[[110, 60], [180, 110], [250, 54], [300, 118], [150, 130], [230, 90]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 8 : 5} fill={i === 5 ? INK : "none"} stroke={INK} strokeWidth="2" />
      ))}
      {[[110, 60, 230, 90], [180, 110, 230, 90], [250, 54, 230, 90], [300, 118, 230, 90], [150, 130, 180, 110], [110, 60, 150, 130]].map(([a, b, c, d], i) => (
        <line key={i} x1={a} y1={b} x2={c} y2={d} {...thin} />
      ))}
      <path d="M 340 86 l 26 0 M 358 78 l 8 8 l -8 8" {...stroke} />
    </g>
  ),
  // recurring controls on a calendar, each with evidence attached
  "compliance-os": () => (
    <g>
      {Array.from({ length: 28 }, (_, i) => (
        <rect key={i} x={48 + (i % 7) * 26} y={36 + Math.floor(i / 7) * 26} width="20" height="20" rx="3" {...thin} />
      ))}
      {[2, 9, 12, 17, 23, 26].map((i) => (
        <path key={i} d={`M ${52 + (i % 7) * 26} ${46 + Math.floor(i / 7) * 26} l 5 5 l 10 -11`} {...stroke} />
      ))}
      <path d="M 240 46 L 340 46 M 240 72 L 320 72 M 240 98 L 332 98 M 240 124 L 300 124" {...stroke} strokeWidth="1.6" />
      <path d="M 232 36 L 232 134" {...thin} />
    </g>
  ),
  // spend as a ledger, forecast as a line that starts from the actuals
  "finops-center": () => (
    <g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={48 + i * 30} y={140 - [40, 52, 46, 66, 60, 74, 70][i]} width="18" height={[40, 52, 46, 66, 60, 74, 70][i]} fill={INK} opacity={i < 5 ? 0.8 : 0.35} />
      ))}
      <path d="M 57 96 L 87 84 L 117 90 L 147 70 L 177 76 L 207 62" {...stroke} />
      <path d="M 207 62 C 250 54, 300 44, 350 38" {...stroke} strokeDasharray="5 7" />
      <line x1="40" y1="140" x2="360" y2="140" {...stroke} />
    </g>
  ),
};

export function StoryCover({ id, style }: { id: string; style?: CSSProperties }) {
  const Art = art[id] ?? art["wealth-os"];
  return (
    <svg className="w-cover" viewBox="0 0 400 175" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={style}>
      <Defs id={id} />
      <rect width="400" height="175" fill={`url(#bg-${id})`} />
      {grid(400, 175, 25)}
      <g filter={`url(#ink-${id})`}>
        <Art />
      </g>
    </svg>
  );
}

/** A sector's line through its stations, drawn tall for a card or wide for a panel. */
export function SectorCover({ id, flow, wide = false }: { id: string; flow: readonly string[]; wide?: boolean }) {
  const w = 400;
  const h = wide ? 175 : 460;
  const n = flow.length;
  const pts: [number, number][] = wide
    ? flow.map((_, i) => [50 + (i * 300) / (n - 1), 88 + (i % 2 ? 22 : -22)])
    : flow.map((_, i) => [80 + (i % 2 ? 190 : 0) + (i % 3 === 2 ? 40 : 0), 130 + (i * 260) / (n - 1)]);
  return (
    <svg className="w-cover" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs id={`s-${id}`} />
      <rect width={w} height={h} fill={`url(#bg-s-${id})`} />
      {grid(w, h, 25)}
      <g filter={`url(#ink-s-${id})`}>
        <path d={wander(pts)} {...stroke} />
        {pts.map(([x, y], i) => (
          <g key={flow[i]}>
            <circle cx={x} cy={y} r={i === n - 1 ? 7 : 5} fill={i === 0 || i === n - 1 ? INK : "rgba(0,0,0,0.6)"} stroke={INK} strokeWidth="2" />
            <text
              x={x + (wide ? 0 : 16)}
              y={y + (wide ? (i % 2 ? 26 : -16) : 5)}
              textAnchor={wide ? "middle" : "start"}
              fill={INK}
              stroke="rgba(0,0,0,0.42)"
              strokeWidth="4"
              paintOrder="stroke"
              fontSize="11"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.08em"
            >
              {flow[i].toUpperCase()}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
