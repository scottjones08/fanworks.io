import { dayCards } from "../content";

type Zone = (typeof dayCards)[number]["zone"];

export const FLOOR = {
  width: 1520,
  height: 860,
} as const;

export const floorRooms: { zone: Zone; label: string; x: number; y: number; w: number; h: number }[] = [
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
      <ellipse cx="0" cy="6" rx="8" ry="11" />
      <circle cx="0" cy="-7" r="6" />
      <path d="M0 -7 v-5" />
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
      <rect x={-w / 2 + 3} y={-h / 2 + 3} width={w} height={h} rx="2" className="floor-shadow-sm" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" />
      <rect x={-w / 2 + 8} y={-h / 2 + 6} width={24} height="9" rx="1" className="floor-screen" />
    </g>
  );
}

function Chair({ x, y }: { x: number | string; y: number | string }) {
  const cx = Number(x);
  const cy = Number(y);
  return (
    <g className="floor-furnish" transform={`translate(${cx} ${cy})`}>
      <rect x="-9" y="-8" width="18" height="16" rx="4" />
      <path d="M-6 -8 v-4 M6 -8 v-4" />
    </g>
  );
}

function Column({ x, y }: { x: number; y: number }) {
  return <rect className="floor-column" x={x - 7} y={y - 7} width="14" height="14" />;
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
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(23,25,22,0.055)" strokeWidth="1" />
        </pattern>
        <pattern id="floor-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(23,25,22,0.14)" strokeWidth="1" />
        </pattern>
        <pattern id="floor-speckle" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="5" r="0.8" fill="rgba(23,25,22,0.08)" />
          <circle cx="12" cy="11" r="0.7" fill="rgba(23,25,22,0.07)" />
          <circle cx="8" cy="2" r="0.6" fill="rgba(23,25,22,0.06)" />
        </pattern>
        <pattern id="floor-park" width="16" height="28" patternUnits="userSpaceOnUse">
          <path d="M1 2 V26" stroke="rgba(23,25,22,0.12)" strokeWidth="1.2" />
        </pattern>
        <filter id="floor-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="floor-dusk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d5a13b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#922b21" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="floor-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d5a13b" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#d5a13b" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect className="floor-paper" x="0" y="0" width="1520" height="860" fill="#efeae0" />
      <rect x="0" y="0" width="1520" height="860" fill="url(#floor-grid)" />

      <g className="floor-site" aria-hidden="true">
        <rect x="48" y="36" width="1424" height="788" fill="none" stroke="rgba(23,25,22,0.16)" strokeDasharray="5 7" />
        <g className="floor-north" transform="translate(1448 78)">
          <circle r="22" fill="rgba(242,238,228,0.8)" stroke="rgba(23,25,22,0.35)" />
          <path d="M0 14 V-14 L-5 -4 H5 L0 -14" fill="#171916" />
          <text y="-28" textAnchor="middle">
            N
          </text>
        </g>
        <rect x="1410" y="540" width="86" height="200" fill="url(#floor-park)" />
        <circle cx="90" cy="790" r="11" fill="rgba(23,60,46,0.12)" stroke="rgba(23,25,22,0.22)" />
        <circle cx="118" cy="804" r="8" fill="rgba(23,60,46,0.1)" stroke="rgba(23,25,22,0.2)" />
        <circle cx="1428" cy="792" r="10" fill="rgba(23,60,46,0.1)" stroke="rgba(23,25,22,0.2)" />
        <path d="M78 804 c8 -16 18 -16 26 0 M1416 806 c8 -14 16 -14 24 0" fill="none" stroke="rgba(23,60,46,0.35)" />
      </g>

      <rect className="floor-shadow" x="128" y="94" width="1280" height="696" rx="2" />

      {floorRooms.map((room, index) => {
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
            {room.zone === "shop" ? (
              <rect x={room.x} y={room.y} width={room.w} height={room.h} fill="url(#floor-speckle)" />
            ) : null}
            {room.zone === "dock" ? (
              <rect x={room.x} y={room.y} width={room.w} height={room.h} fill="url(#floor-hatch)" opacity="0.35" />
            ) : null}
            <rect
              className="floor-bloom"
              x={room.x + 10}
              y={room.y + 10}
              width={room.w - 20}
              height={room.h - 20}
              rx="4"
              filter="url(#floor-glow)"
            />
            {isFinale ? (
              <rect className="floor-dusk" x={room.x} y={room.y} width={room.w} height={room.h} fill="url(#floor-dusk)" />
            ) : null}
            <text className="floor-label" x={room.x + 18} y={room.y + 30}>
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
      <g className="floor-columns" aria-hidden="true">
        <Column x={480} y={80} />
        <Column x={480} y={360} />
        <Column x={480} y={620} />
        <Column x={1000} y={80} />
        <Column x={1000} y={360} />
        <Column x={1000} y={620} />
        <Column x={120} y={360} />
        <Column x={1400} y={360} />
      </g>

      <g className="floor-openings" aria-hidden="true">
        <path className="floor-door" d="M456 248 H480 M456 248 A24 24 0 0 1 480 272" />
        <path className="floor-door" d="M456 470 H480 M456 470 A24 24 0 0 0 480 446" />
        <path className="floor-door" d="M976 214 H1000 M1000 214 A24 24 0 0 1 976 238" />
        <path className="floor-door" d="M976 470 H1000 M1000 470 A24 24 0 0 0 976 446" />
        <path className="floor-door" d="M300 620 V644 M300 620 A24 24 0 0 0 324 644" />
        <path className="floor-door" d="M740 620 V644 M740 620 A24 24 0 0 1 716 644" />
        <rect className="floor-sill" x="198" y="76" width="84" height="8" fill="url(#floor-glass)" />
        <rect className="floor-sill" x="518" y="76" width="104" height="8" fill="url(#floor-glass)" />
        <rect className="floor-sill" x="698" y="76" width="122" height="8" fill="url(#floor-glass)" />
        <rect className="floor-sill" x="1038" y="76" width="102" height="8" fill="url(#floor-glass)" />
        <path className="floor-window" d="M200 76 H280 M360 76 H430 M520 76 H620 M700 76 H820 M1040 76 H1140 M1220 76 H1340" />
        <path className="floor-window" d="M120 140 H116 M120 200 H116 M120 420 H116 M120 500 H116" />
        <path className="floor-window" d="M180 780 H300 M360 780 H500 M560 780 H700 M780 780 H920 M1020 780 H1180 M1240 780 H1360" />
        <path className="floor-dockdoor" d="M1456 408 V504" />
      </g>

      <g className={`floor-room-detail${allLit || active >= 0 ? " is-on" : ""}`} data-detail="ops">
        <rect className="floor-rug" x="168" y="132" width="264" height="168" rx="6" />
        <Desk x="210" y="170" />
        <Chair x="210" y="210" />
        <Desk x="330" y="170" />
        <Chair x="330" y="210" />
        <Desk x="270" y="280" w={110} h={40} />
        <Chair x="270" y="316" />
        <Person x="210" y="146" facing={180} tone="brick" />
        <Person x="332" y="146" facing={180} tone="green" />
        <text className="floor-note" x="138" y="338">
          Three screens · one floor
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 1 ? " is-on" : ""}`} data-detail="intake">
        <rect className="floor-furnish floor-counter" x="548" y="140" width="300" height="44" rx="2" />
        <rect className="floor-ticket floor-life" x="568" y="150" width="48" height="22" rx="1" />
        <rect className="floor-ticket floor-life" x="628" y="150" width="48" height="22" rx="1" />
        <rect className="floor-ticket floor-life" x="688" y="150" width="48" height="22" rx="1" />
        <rect className="floor-ticket is-paper floor-life" x="748" y="150" width="48" height="22" rx="1" />
        <rect className="floor-furnish is-machine" x="860" y="196" width="74" height="90" rx="3" />
        <circle className="floor-furnish" cx="897" cy="230" r="15" />
        <path className="floor-furnish" d="M882 268 h30" />
        <Person x="620" y="220" facing={0} tone="ochre" />
        <Person x="704" y="122" facing={180} tone="brick" />
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
        <rect className="floor-inbox" x="186" y="412" width="20" height="13" />
        <rect className="floor-inbox" x="306" y="412" width="20" height="13" />
        <rect className="floor-inbox" x="186" y="512" width="20" height="13" />
        <rect className="floor-tag floor-life" x="348" y="508" width="28" height="14" rx="2" />
        <Person x="210" y="406" facing={180} tone="green" />
        <Person x="354" y="528" facing={-90} tone="brick" />
        <text className="floor-note" x="138" y="598">
          One name on the job
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 3 ? " is-on" : ""}`} data-detail="shop">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${536 + i * 112} 424)`}>
            <rect className="floor-shadow-sm" x="4" y="4" width="88" height="66" rx="2" />
            <rect className="floor-furnish is-cell" x="0" y="0" width="88" height="66" rx="2" />
            <circle cx="44" cy="33" r="15" className="floor-furnish" />
            <path className="floor-check floor-life" d="M33 35 l8 8 16 -18" />
            <text className="floor-cell-no" x="8" y="58">
              0{i + 1}
            </text>
          </g>
        ))}
        <Person x="580" y="522" facing={0} tone="brick" />
        <Person x="692" y="522" facing={0} tone="green" />
        <Person x="804" y="522" facing={0} tone="ochre" />
        <text className="floor-note" x="498" y="598">
          Four cells · one way
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 4 ? " is-on" : ""}`} data-detail="dock">
        <g className="floor-racks">
          {[0, 1, 2, 3, 4].map((col) => (
            <g key={col} transform={`translate(${1044 + col * 68} 128)`}>
              <rect x="5" y="6" width="46" height="214" className="floor-shadow-sm" />
              <rect className="floor-furnish" x="0" y="0" width="46" height="214" fill="url(#floor-hatch)" />
              <path d="M0 42 H46 M0 84 H46 M0 126 H46 M0 168 H46" />
              <text className="floor-cell-no" x="10" y="228">
                B{col + 1}
              </text>
            </g>
          ))}
        </g>
        <rect className="floor-pallet" x="1088" y="430" width="46" height="38" />
        <path className="floor-pallet" d="M1088 430 L1134 468 M1134 430 L1088 468" />
        <rect className="floor-pallet is-alert floor-life" x="1160" y="430" width="46" height="38" />
        <path className="floor-pallet is-alert floor-life" d="M1160 430 L1206 468 M1206 430 L1160 468" />
        <g className="floor-truck floor-life" transform="translate(1472 404)">
          <rect x="4" y="8" width="24" height="80" rx="3" className="floor-shadow-sm" />
          <rect x="0" y="4" width="24" height="80" rx="3" />
          <rect x="24" y="18" width="14" height="52" rx="2" />
          <circle cx="8" cy="14" r="3.5" />
          <circle cx="8" cy="74" r="3.5" />
          <circle cx="31" cy="26" r="3" />
          <circle cx="31" cy="62" r="3" />
        </g>
        <Person x="1288" y="470" facing={90} tone="brick" />
        <text className="floor-note" x="1018" y="598">
          Flagged before the truck
        </text>
      </g>

      <g className={`floor-room-detail${allLit || active >= 5 ? " is-on" : ""}`} data-detail="close">
        <rect className="floor-furnish" x="200" y="666" width="168" height="76" rx="2" />
        <path className="floor-chart floor-life" d="M222 726 V698 M252 726 V684 M282 726 V704 M312 726 V674 M342 726 V690" />
        <circle className="floor-lamp floor-life" cx="430" cy="700" r="5" />
        <circle className="floor-lamp floor-life" cx="620" cy="700" r="5" />
        <circle className="floor-lamp floor-life" cx="810" cy="700" r="5" />
        <Desk x="980" y="700" w={100} h={42} />
        <Chair x="980" y="736" />
        <Person x="980" y="676" facing={180} tone="ochre" />
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
        <circle className="floor-pin-pulse" r="26" />
        <circle className="floor-pin-ring" r="11" fill="none" />
        <circle r="5.5" />
        <text className="floor-pin-time" y="-32" textAnchor="middle">
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
