import { dayCards } from "../content";

type Zone = (typeof dayCards)[number]["zone"];

const rooms: { zone: Zone; label: string; x: number; y: number; w: number; h: number }[] = [
  { zone: "ops", label: "Front office", x: 120, y: 80, w: 360, h: 280 },
  { zone: "intake", label: "Order desk", x: 480, y: 80, w: 520, h: 280 },
  { zone: "bullpen", label: "Bullpen", x: 120, y: 360, w: 360, h: 260 },
  { zone: "shop", label: "Shop floor", x: 480, y: 360, w: 520, h: 260 },
  { zone: "dock", label: "Warehouse & dock", x: 1000, y: 80, w: 400, h: 540 },
  { zone: "close", label: "Close-out", x: 120, y: 620, w: 1280, h: 160 },
];

function Person({
  x,
  y,
  facing = 0,
  tone = "ink",
}: {
  x: number | string;
  y: number | string;
  facing?: number;
  tone?: "ink" | "brick" | "green" | "ochre";
}) {
  return (
    <g className={`floor-life floor-person is-${tone}`} transform={`translate(${x} ${y}) rotate(${facing})`}>
      <ellipse cx="0" cy="5" rx="7" ry="9" />
      <circle cx="0" cy="-6" r="5.5" />
      <path d="M0 -6 v-4" />
    </g>
  );
}

function Desk({
  x,
  y,
  w = 86,
  h = 44,
  rotate = 0,
}: {
  x: number | string;
  y: number | string;
  w?: number;
  h?: number;
  rotate?: number;
}) {
  return (
    <g className="floor-furnish" transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" />
      <rect x={-w / 2 + 8} y={-h / 2 + 6} width={22} height="8" rx="1" className="floor-screen" />
    </g>
  );
}

function Chair({ x, y }: { x: number | string; y: number | string }) {
  const cx = Number(x);
  const cy = Number(y);
  return <rect className="floor-furnish" x={cx - 8} y={cy - 7} width="16" height="14" rx="3" />;
}

export function FloorPlan({ active, allLit }: { active: number; allLit?: boolean }) {
  const liveZone = dayCards[active].zone;
  const pin = dayCards[active].focus;

  return (
    <svg
      className="floor-svg"
      viewBox="0 0 1520 860"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Architectural floor plan of a working building. Rooms light up through the day: front office, order desk, bullpen, shop floor, warehouse and dock, then close-out."
    >
      <defs>
        <pattern id="floor-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(23,25,22,0.06)" strokeWidth="1" />
        </pattern>
        <pattern id="floor-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(23,25,22,0.12)" strokeWidth="1" />
        </pattern>
        <filter id="floor-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="floor-dusk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d5a13b" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#922b21" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <rect className="floor-paper" x="0" y="0" width="1520" height="860" fill="url(#floor-grid)" />

      <g className="floor-site" aria-hidden="true">
        <rect x="48" y="36" width="1424" height="788" fill="none" stroke="rgba(23,25,22,0.18)" strokeDasharray="6 8" />
        <g className="floor-north" transform="translate(1448 78)">
          <circle r="22" fill="none" stroke="rgba(23,25,22,0.35)" />
          <path d="M0 14 V-14 L-5 -4 H5 L0 -14" fill="#171916" />
          <text y="-28" textAnchor="middle">N</text>
        </g>
        <circle cx="90" cy="790" r="10" fill="none" stroke="rgba(23,25,22,0.2)" />
        <circle cx="118" cy="804" r="7" fill="none" stroke="rgba(23,25,22,0.2)" />
        <circle cx="1428" cy="792" r="9" fill="none" stroke="rgba(23,25,22,0.2)" />
        <path d="M78 804 c8 -16 18 -16 26 0 M1416 806 c8 -14 16 -14 24 0" fill="none" stroke="rgba(23,25,22,0.2)" />
      </g>

      <rect className="floor-shadow" x="128" y="92" width="1280" height="696" rx="2" />

      {rooms.map((room, index) => {
        const live = !allLit && liveZone === room.zone;
        const visited = allLit || index <= active;
        const isFinale = room.zone === "close";
        return (
          <g
            key={room.zone}
            className={`floor-room${live ? " is-live" : ""}${visited ? " is-visited" : ""}${isFinale ? " is-finale" : ""}`}
            data-zone={room.zone}
          >
            <rect className="floor-fill" x={room.x} y={room.y} width={room.w} height={room.h} />
            <rect
              className="floor-bloom"
              x={room.x + 10}
              y={room.y + 10}
              width={room.w - 20}
              height={room.h - 20}
              rx="4"
              filter="url(#floor-glow)"
            />
            {isFinale ? <rect className="floor-dusk" x={room.x} y={room.y} width={room.w} height={room.h} fill="url(#floor-dusk)" /> : null}
            <text className="floor-label" x={room.x + 18} y={room.y + 28}>
              {String(index + 1).padStart(2, "0")} · {room.label}
            </text>
          </g>
        );
      })}

      <g className="floor-walls" aria-hidden="true">
        <rect x="120" y="80" width="1280" height="700" fill="none" />
        <path d="M480 80 V620 M1000 80 V620 M120 360 H480 M480 360 H1000 M120 620 H1400" />
        <rect x="1400" y="392" width="56" height="128" fill="none" />
      </g>

      <g className="floor-openings" aria-hidden="true">
        <path className="floor-door" d="M456 248 H480 M456 248 A24 24 0 0 1 480 272" />
        <path className="floor-door" d="M456 470 H480 M456 470 A24 24 0 0 0 480 446" />
        <path className="floor-door" d="M976 214 H1000 M1000 214 A24 24 0 0 1 976 238" />
        <path className="floor-door" d="M976 470 H1000 M1000 470 A24 24 0 0 0 976 446" />
        <path className="floor-door" d="M300 620 V644 M300 620 A24 24 0 0 0 324 644" />
        <path className="floor-door" d="M740 620 V644 M740 620 A24 24 0 0 1 716 644" />
        <path className="floor-window" d="M168 80 V80 M200 76 H280 M360 76 H430 M520 76 H620 M700 76 H820 M1040 76 H1140 M1220 76 H1340" />
        <path className="floor-window" d="M120 140 H116 M120 200 H116 M120 420 H116 M120 500 H116" />
        <path className="floor-window" d="M180 780 H300 M360 780 H500 M560 780 H700 M780 780 H920 M1020 780 H1180 M1240 780 H1360" />
        <path className="floor-dockdoor" d="M1456 408 V504" />
      </g>

      <g className={`floor-room-detail${allLit || active >= 0 ? " is-on" : ""}`} data-detail="ops">
        <Desk x="210" y="170" />
        <Chair x="210" y="210" />
        <Desk x="330" y="170" />
        <Chair x="330" y="210" />
        <Desk x="270" y="280" w={110} h={40} />
        <Chair x="270" y="316" />
        <Person x="210" y="148" facing={180} tone="brick" />
        <Person x="332" y="148" facing={180} tone="green" />
        <text className="floor-note" x="138" y="338">
          Three screens · one floor
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 1 ? " is-on" : ""}`} data-detail="intake">
        <rect className="floor-furnish" x="560" y="148" width="280" height="36" rx="2" />
        <rect className="floor-ticket floor-life" x="580" y="156" width="44" height="20" />
        <rect className="floor-ticket floor-life" x="636" y="156" width="44" height="20" />
        <rect className="floor-ticket floor-life" x="692" y="156" width="44" height="20" />
        <rect className="floor-furnish is-machine" x="860" y="200" width="70" height="86" rx="3" />
        <circle className="floor-furnish" cx="895" cy="232" r="14" />
        <Person x="620" y="220" facing={0} tone="ochre" />
        <Person x="704" y="124" facing={180} tone="brick" />
        <text className="floor-note" x="498" y="338">
          Quote · ticket · invoice
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 2 ? " is-on" : ""}`} data-detail="bullpen">
        <Desk x="210" y="430" w={72} h={40} />
        <Desk x="330" y="430" w={72} h={40} />
        <Desk x="210" y="530" w={72} h={40} />
        <Desk x="330" y="530" w={72} h={40} />
        <Chair x="210" y="464" />
        <Chair x="330" y="464" />
        <rect className="floor-inbox" x="188" y="414" width="18" height="12" />
        <rect className="floor-inbox" x="308" y="414" width="18" height="12" />
        <rect className="floor-inbox" x="188" y="514" width="18" height="12" />
        <Person x="210" y="408" facing={180} tone="green" />
        <Person x="354" y="528" facing={-90} tone="brick" />
        <text className="floor-note" x="138" y="598">
          One name on the job
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 3 ? " is-on" : ""}`} data-detail="shop">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${540 + i * 110} 430)`}>
            <rect className="floor-furnish is-cell" x="0" y="0" width="86" height="64" rx="2" />
            <circle cx="43" cy="32" r="14" className="floor-furnish" />
            <path className="floor-check floor-life" d="M32 34 l8 8 16 -18" />
          </g>
        ))}
        <Person x="582" y="520" facing={0} tone="brick" />
        <Person x="692" y="520" facing={0} tone="green" />
        <Person x="802" y="520" facing={0} tone="ochre" />
        <text className="floor-note" x="498" y="598">
          Four cells · one way
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 4 ? " is-on" : ""}`} data-detail="dock">
        <g className="floor-racks">
          {[0, 1, 2, 3, 4].map((col) => (
            <g key={col} transform={`translate(${1040 + col * 68} 130)`}>
              <rect className="floor-furnish" x="0" y="0" width="48" height="220" fill="url(#floor-hatch)" />
              <path d="M0 44 H48 M0 88 H48 M0 132 H48 M0 176 H48" />
            </g>
          ))}
        </g>
        <rect className="floor-pallet" x="1088" y="430" width="44" height="36" />
        <path className="floor-pallet" d="M1088 430 L1132 466 M1132 430 L1088 466" />
        <rect className="floor-pallet is-alert floor-life" x="1160" y="430" width="44" height="36" />
        <path className="floor-pallet is-alert floor-life" d="M1160 430 L1204 466 M1204 430 L1160 466" />
        <g className="floor-truck floor-life" transform="translate(1478 420)">
          <rect x="0" y="0" width="22" height="72" rx="3" />
          <rect x="22" y="10" width="10" height="52" rx="2" />
          <circle cx="8" cy="8" r="3" />
          <circle cx="8" cy="64" r="3" />
        </g>
        <Person x="1288" y="470" facing={90} tone="brick" />
        <text className="floor-note" x="1018" y="598">
          Flagged before the truck
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 5 ? " is-on" : ""}`} data-detail="close">
        <rect className="floor-furnish" x="200" y="668" width="160" height="72" rx="2" />
        <path className="floor-chart floor-life" d="M220 724 V700 M248 724 V688 M276 724 V706 M304 724 V678 M332 724 V692" />
        <Desk x="980" y="700" w={100} h={42} />
        <Chair x="980" y="736" />
        <Person x="980" y="678" facing={180} tone="ochre" />
        <Person x="280" y="704" facing={90} tone="green" />
        <text className="floor-note" x="138" y="760">
          Leave with the numbers
        </text>
      </g>

      <path
        data-line="true"
        pathLength={1}
        className="floor-path"
        d="M300 220 C 470 150, 620 150, 740 220 C 620 310, 430 360, 300 490 C 470 540, 640 500, 740 490 C 920 470, 1080 390, 1200 350 C 1260 470, 1100 650, 760 700"
      />
      <circle className="floor-path-end" cx="760" cy="700" r="5" />

      <g
        className={`floor-pin${dayCards[active].zone === "close" ? " is-finale" : ""}`}
        style={{ transform: `translate(${pin.x}px, ${pin.y}px)` }}
        aria-hidden="true"
      >
        <circle className="floor-pin-pulse" r="22" />
        <circle r="6.5" />
        <text className="floor-pin-time" y="-28" textAnchor="middle">
          {dayCards[active].time}
        </text>
      </g>

      <g className="floor-titleblock" aria-hidden="true">
        <rect x="1188" y="792" width="252" height="48" />
        <text x="1204" y="812">
          FANWORKS · DWG 01
        </text>
        <text x="1204" y="830">
          Typical operations floor · 1 : 200
        </text>
      </g>
    </svg>
  );
}
