import { dayCards } from "../content";

type Zone = (typeof dayCards)[number]["zone"];

const OX = 620;
const OY = 92;
const SX = 0.84;
const SY = 0.46;
const WALL = 70;

const BAY_W = 280;
const BAY_D = 200;
const AISLE_Y = 200;
const AISLE_D = 92;

export const FLOOR = {
  width: 1180,
  height: 720,
} as const;

export function iso(x: number, y: number, z = 0) {
  return { x: OX + (x - y) * SX, y: OY + (x + y) * SY - z };
}

export const floorRooms: { zone: Zone; label: string; x: number; y: number; w: number; h: number }[] = [
  { zone: "ops", label: "Front office", x: 0, y: 0, w: BAY_W, h: BAY_D },
  { zone: "intake", label: "Order desk", x: BAY_W, y: 0, w: BAY_W, h: BAY_D },
  { zone: "bullpen", label: "Bullpen", x: BAY_W * 2, y: 0, w: BAY_W, h: BAY_D },
  { zone: "shop", label: "Shop floor", x: BAY_W * 2, y: AISLE_Y + AISLE_D, w: BAY_W, h: BAY_D },
  { zone: "dock", label: "Warehouse", x: BAY_W, y: AISLE_Y + AISLE_D, w: BAY_W, h: BAY_D },
  { zone: "close", label: "Close-out", x: 0, y: AISLE_Y + AISLE_D, w: BAY_W, h: BAY_D },
];

export const BUILDING = {
  w: BAY_W * 3,
  d: AISLE_Y + AISLE_D + BAY_D,
  aisleY: AISLE_Y,
  aisleD: AISLE_D,
} as const;

export function roomCenter(room: (typeof floorRooms)[number]) {
  return iso(room.x + room.w / 2, room.y + room.h / 2, 18);
}

function pts(list: { x: number; y: number }[]) {
  return list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function IsoFloor({
  x,
  y,
  w,
  d,
  z = 0,
  className,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  z?: number;
  className?: string;
}) {
  return (
    <polygon
      className={className}
      points={pts([iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)])}
    />
  );
}

function IsoWallWest({
  x,
  y,
  d,
  h = WALL,
  className = "iso-west",
}: {
  x: number;
  y: number;
  d: number;
  h?: number;
  className?: string;
}) {
  return <polygon className={className} points={pts([iso(x, y, 0), iso(x, y + d, 0), iso(x, y + d, h), iso(x, y, h)])} />;
}

function IsoWallNorth({
  x,
  y,
  w,
  h = WALL,
  className = "iso-north",
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  className?: string;
}) {
  return <polygon className={className} points={pts([iso(x, y, 0), iso(x + w, y, 0), iso(x + w, y, h), iso(x, y, h)])} />;
}

function IsoBox({
  x,
  y,
  w,
  d,
  h,
  z = 0,
  tone = "wood",
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  z?: number;
  tone?: "wood" | "ink" | "ochre" | "brick" | "green" | "alert";
}) {
  return (
    <g className={`iso-box is-${tone}`}>
      <polygon className="iso-west" points={pts([iso(x, y, z), iso(x, y + d, z), iso(x, y + d, z + h), iso(x, y, z + h)])} />
      <polygon className="iso-east" points={pts([iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)])} />
      <polygon className="iso-south" points={pts([iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} />
      <polygon className="iso-north" points={pts([iso(x, y, z), iso(x + w, y, z), iso(x + w, y, z + h), iso(x, y, z + h)])} />
      <polygon className="iso-top" points={pts([iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} />
    </g>
  );
}

function IsoWindow({ x, w }: { x: number; w: number }) {
  return (
    <polygon
      className="iso-window"
      points={pts([iso(x, 0, 20), iso(x + w, 0, 20), iso(x + w, 0, 52), iso(x, 0, 52)])}
    />
  );
}

function BayGear({ zone }: { zone: Zone }) {
  const room = floorRooms.find((item) => item.zone === zone)!;
  const x = room.x;
  const y = room.y;
  if (zone === "ops") {
    return (
      <>
        <IsoBox x={x + 36} y={y + 36} w={90} d={52} h={18} tone="wood" />
        <IsoBox x={x + 54} y={y + 46} w={36} d={12} h={16} z={18} tone="ink" />
        <IsoBox x={x + 154} y={y + 36} w={90} d={52} h={18} tone="wood" />
        <IsoBox x={x + 172} y={y + 46} w={36} d={12} h={16} z={18} tone="ink" />
      </>
    );
  }
  if (zone === "intake") {
    return (
      <>
        <IsoBox x={x + 28} y={y + 40} w={224} d={40} h={20} tone="wood" />
        <IsoBox x={x + 48} y={y + 48} w={40} d={22} h={5} z={20} tone="ochre" />
        <IsoBox x={x + 100} y={y + 48} w={40} d={22} h={5} z={20} tone="ochre" />
        <IsoBox x={x + 152} y={y + 48} w={40} d={22} h={5} z={20} tone="brick" />
        <IsoBox x={x + 210} y={y + 96} w={40} d={40} h={44} tone="ink" />
      </>
    );
  }
  if (zone === "bullpen") {
    return (
      <>
        <IsoBox x={x + 32} y={y + 28} w={88} d={44} h={16} tone="wood" />
        <IsoBox x={x + 160} y={y + 28} w={88} d={44} h={16} tone="wood" />
        <IsoBox x={x + 32} y={y + 108} w={88} d={44} h={16} tone="wood" />
        <IsoBox x={x + 160} y={y + 108} w={88} d={44} h={16} tone="wood" />
      </>
    );
  }
  if (zone === "shop") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <IsoBox x={x + 32 + i * 82} y={y + 48} w={68} d={68} h={24} tone="green" />
            <IsoBox x={x + 46 + i * 82} y={y + 62} w={40} d={40} h={16} z={24} tone="ochre" />
          </g>
        ))}
      </>
    );
  }
  if (zone === "dock") {
    return (
      <>
        <IsoBox x={x + 28} y={y + 28} w={56} d={150} h={58} tone="wood" />
        <IsoBox x={x + 100} y={y + 28} w={56} d={150} h={58} tone="wood" />
        <IsoBox x={x + 172} y={y + 28} w={56} d={150} h={58} tone="wood" />
        <IsoBox x={x + 236} y={y + 150} w={32} d={32} h={16} tone="alert" />
      </>
    );
  }
  return (
    <>
      <IsoBox x={x + 48} y={y + 44} w={140} d={70} h={20} tone="ink" />
      <IsoBox x={x + 68} y={y + 58} w={22} d={22} h={24} z={20} tone="ochre" />
      <IsoBox x={x + 98} y={y + 54} w={22} d={22} h={36} z={20} tone="ochre" />
      <IsoBox x={x + 128} y={y + 60} w={22} d={22} h={20} z={20} tone="ochre" />
      <IsoBox x={x + 158} y={y + 52} w={22} d={22} h={40} z={20} tone="ochre" />
    </>
  );
}

function BayLabel({
  room,
  index,
  time,
  live,
}: {
  room: (typeof floorRooms)[number];
  index: number;
  time: string;
  live: boolean;
}) {
  const towardAisle = room.y < AISLE_Y;
  const p = iso(room.x + room.w / 2, towardAisle ? room.y + room.h - 22 : room.y + 22, 6);
  return (
    <g className={`floor-sign${live ? " is-live" : ""}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
      <rect className="floor-sign-board" x="-72" y="-28" width="144" height="48" rx="2" />
      <text className="floor-sign-index" x="0" y="-8">
        {`${String(index + 1).padStart(2, "0")}  ·  ${time}`}
      </text>
      <text className="floor-sign-name" x="0" y="14">
        {room.label}
      </text>
    </g>
  );
}

function BayNumber({ room, index }: { room: (typeof floorRooms)[number]; index: number }) {
  const p = iso(room.x + room.w / 2, room.y + room.h / 2, 1);
  return (
    <text className="floor-mark" x={p.x} y={p.y} textAnchor="middle">
      {String(index + 1).padStart(2, "0")}
    </text>
  );
}

export function FloorPlan({
  active,
  allLit,
  overview,
}: {
  active: number;
  allLit?: boolean;
  overview?: boolean;
}) {
  const liveZone = dayCards[Math.max(0, active)].zone;
  const pin = iso(dayCards[Math.max(0, active)].focus.x, dayCards[Math.max(0, active)].focus.y, 28);
  const pathPts = [
    iso(140, 218, 4),
    iso(420, 218, 4),
    iso(700, 218, 4),
    iso(700, 274, 4),
    iso(420, 274, 4),
    iso(140, 274, 4),
  ];
  const pathD = `M ${pathPts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`;
  const spine = iso(BUILDING.w / 2, AISLE_Y + AISLE_D / 2, 8);
  const morning = iso(24, AISLE_Y + 28, 8);
  const evening = iso(24, AISLE_Y + AISLE_D - 18, 8);
  const drawRooms = [...floorRooms].sort((a, b) => a.x + a.y - (b.x + b.y));

  return (
    <svg
      className="floor-svg"
      viewBox="190 20 1180 720"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Cutaway of a shop floor. Six stations sit on one U-shaped line of work, from 7 AM to 6 PM."
    >
      <defs>
        <linearGradient id="iso-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7d7a8" stopOpacity="0.32" />
          <stop offset="58%" stopColor="#efeae0" stopOpacity="0" />
        </linearGradient>
        <filter id="iso-drop">
          <feDropShadow dx="10" dy="16" stdDeviation="12" floodColor="#171916" floodOpacity="0.16" />
        </filter>
      </defs>

      <rect x="190" y="20" width="1180" height="720" fill="url(#iso-sky)" />

      <g className="iso-ground" filter="url(#iso-drop)" aria-hidden="true">
        <IsoFloor className="iso-lot" x={-24} y={-20} w={BUILDING.w + 80} d={BUILDING.d + 56} />
      </g>

      <IsoFloor className="iso-hall" x={0} y={0} w={BUILDING.w} d={BUILDING.d} />
      <IsoWallNorth x={0} y={0} w={BUILDING.w} />
      <IsoWallWest x={0} y={0} d={BUILDING.d} />
      <IsoWindow x={48} w={180} />
      <IsoWindow x={328} w={180} />
      <IsoWindow x={608} w={180} />

      {drawRooms.map((room) => {
        const index = floorRooms.findIndex((item) => item.zone === room.zone);
        const live = !allLit && !overview && liveZone === room.zone;
        const visited = allLit || (!overview && index <= active);
        const isFinale = room.zone === "close" && (allLit || (!overview && index <= active));
        return (
          <g
            key={room.zone}
            className={`floor-room${live ? " is-live" : ""}${visited ? " is-visited" : ""}${isFinale ? " is-finale" : ""}`}
            data-zone={room.zone}
          >
            <IsoFloor className="iso-slab" x={room.x} y={room.y} w={room.w} d={room.h} />
            <IsoFloor className="floor-bloom" x={room.x + 12} y={room.y + 12} w={room.w - 24} d={room.h - 24} z={1} />
            {room.x > 0 ? <IsoWallWest x={room.x} y={room.y} d={room.h} h={40} className="iso-west iso-partition" /> : null}
            {room.y > AISLE_Y ? <IsoWallNorth x={room.x} y={room.y} w={room.w} h={40} className="iso-north iso-partition" /> : null}
            <BayNumber room={room} index={index} />
            <g className="floor-room-detail is-on">
              <BayGear zone={room.zone} />
            </g>
          </g>
        );
      })}

      <IsoFloor className="iso-aisle" x={0} y={AISLE_Y} w={BUILDING.w} d={AISLE_D} z={1} />
      <text className="floor-spine" x={spine.x} y={spine.y} textAnchor="middle">
        The line of work
      </text>
      <text className="floor-endcap" x={morning.x} y={morning.y}>
        7 AM · in
      </text>
      <text className="floor-endcap is-out" x={evening.x} y={evening.y}>
        out · 6 PM
      </text>

      <path className="floor-path-ghost" d={pathD} />
      <path className="floor-path-shadow" d={pathD} />
      <path data-line="true" pathLength={1} className="floor-path" d={pathD} />
      <circle data-traveler="true" className="floor-traveler" r="8" cx={pathPts[0].x} cy={pathPts[0].y} />

      {floorRooms.map((room, index) => (
        <BayLabel
          key={`sign-${room.zone}`}
          room={room}
          index={index}
          time={dayCards[index].time}
          live={allLit || (!overview && index === active)}
        />
      ))}

      {overview || allLit ? null : (
        <g
          className={`floor-pin${dayCards[active].zone === "close" ? " is-finale" : ""}`}
          style={{ transform: `translate(${pin.x}px, ${pin.y}px)` }}
          aria-hidden="true"
        >
          <circle className="floor-pin-pulse" r="26" />
          <circle className="floor-pin-ring" r="11" fill="none" />
          <circle r="5" />
        </g>
      )}
    </svg>
  );
}
