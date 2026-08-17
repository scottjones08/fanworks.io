import { dayCards } from "../content";

type Zone = (typeof dayCards)[number]["zone"];

const OX = 348;
const OY = 108;
const SX = 0.9;
const SY = 0.38;
const WALL = 62;

const BAY_W = 216;
const BAY_D = 250;
const AISLE_Y = 250;
const AISLE_D = 98;

export const FLOOR = {
  width: 1760,
  height: 820,
} as const;

export function iso(x: number, y: number, z = 0) {
  return { x: OX + (x - y) * SX, y: OY + (x + y) * SY - z };
}

export const floorRooms: { zone: Zone; label: string; x: number; y: number; w: number; h: number }[] = [
  { zone: "ops", label: "Front office", x: 0, y: 0, w: BAY_W, h: BAY_D },
  { zone: "intake", label: "Order desk", x: BAY_W, y: 0, w: BAY_W, h: BAY_D },
  { zone: "bullpen", label: "Bullpen", x: BAY_W * 2, y: 0, w: BAY_W, h: BAY_D },
  { zone: "shop", label: "Shop floor", x: BAY_W * 3, y: 0, w: BAY_W, h: BAY_D },
  { zone: "dock", label: "Warehouse", x: BAY_W * 4, y: 0, w: BAY_W, h: BAY_D },
  { zone: "close", label: "Close-out", x: BAY_W * 5, y: 0, w: BAY_W, h: BAY_D },
];

export const BUILDING = {
  w: BAY_W * 6,
  d: AISLE_Y + AISLE_D,
  aisleY: AISLE_Y,
  aisleD: AISLE_D,
} as const;

export function roomCenter(room: (typeof floorRooms)[number]) {
  return iso(room.x + room.w / 2, room.y + room.h * 0.62, 20);
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

function IsoWallWest({ x, y, d, h = WALL, className = "iso-west" }: { x: number; y: number; d: number; h?: number; className?: string }) {
  return <polygon className={className} points={pts([iso(x, y, 0), iso(x, y + d, 0), iso(x, y + d, h), iso(x, y, h)])} />;
}

function IsoWallNorth({ x, y, w, h = WALL, className = "iso-north" }: { x: number; y: number; w: number; h?: number; className?: string }) {
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
      points={pts([iso(x, 0, 18), iso(x + w, 0, 18), iso(x + w, 0, 46), iso(x, 0, 46)])}
    />
  );
}

function BayGear({ zone }: { zone: Zone }) {
  const x = floorRooms.find((room) => room.zone === zone)!.x;
  if (zone === "ops") {
    return (
      <>
        <IsoBox x={x + 28} y={36} w={72} d={40} h={16} tone="wood" />
        <IsoBox x={x + 40} y={44} w={20} d={8} h={14} z={16} tone="ink" />
        <IsoBox x={x + 116} y={36} w={72} d={40} h={16} tone="wood" />
        <IsoBox x={x + 128} y={44} w={20} d={8} h={14} z={16} tone="ink" />
        <IsoBox x={x + 44} y={46} w={12} d={4} h={10} z={30} tone="ochre" />
        <IsoBox x={x + 132} y={46} w={12} d={4} h={10} z={30} tone="ochre" />
      </>
    );
  }
  if (zone === "intake") {
    return (
      <>
        <IsoBox x={x + 24} y={40} w={168} d={32} h={18} tone="wood" />
        <IsoBox x={x + 40} y={46} w={28} d={16} h={4} z={18} tone="ochre" />
        <IsoBox x={x + 78} y={46} w={28} d={16} h={4} z={18} tone="ochre" />
        <IsoBox x={x + 116} y={46} w={28} d={16} h={4} z={18} tone="brick" />
        <IsoBox x={x + 160} y={78} w={32} d={32} h={36} tone="ink" />
      </>
    );
  }
  if (zone === "bullpen") {
    return (
      <>
        <IsoBox x={x + 28} y={32} w={68} d={36} h={14} tone="wood" />
        <IsoBox x={x + 120} y={32} w={68} d={36} h={14} tone="wood" />
        <IsoBox x={x + 28} y={118} w={68} d={36} h={14} tone="wood" />
        <IsoBox x={x + 120} y={118} w={68} d={36} h={14} tone="wood" />
        <IsoBox x={x + 148} y={124} w={22} d={12} h={5} z={14} tone="brick" />
      </>
    );
  }
  if (zone === "shop") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <IsoBox x={x + 28 + i * 62} y={48} w={50} d={50} h={20} tone="green" />
            <IsoBox x={x + 40 + i * 62} y={60} w={26} d={26} h={14} z={20} tone="ochre" />
          </g>
        ))}
      </>
    );
  }
  if (zone === "dock") {
    return (
      <>
        <IsoBox x={x + 24} y={28} w={40} d={140} h={52} tone="wood" />
        <IsoBox x={x + 76} y={28} w={40} d={140} h={52} tone="wood" />
        <IsoBox x={x + 128} y={28} w={40} d={140} h={52} tone="wood" />
        <IsoBox x={x + 172} y={176} w={28} d={28} h={12} tone="alert" />
      </>
    );
  }
  return (
    <>
      <IsoBox x={x + 36} y={48} w={96} d={52} h={18} tone="ink" />
      <IsoBox x={x + 50} y={58} w={10} d={10} h={20} z={18} tone="ochre" />
      <IsoBox x={x + 68} y={56} w={10} d={10} h={28} z={18} tone="ochre" />
      <IsoBox x={x + 86} y={60} w={10} d={10} h={16} z={18} tone="ochre" />
      <IsoBox x={x + 104} y={54} w={10} d={10} h={32} z={18} tone="ochre" />
    </>
  );
}

function StationSign({
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
  const p = iso(room.x + room.w / 2, AISLE_Y + 72, 4);
  return (
    <g className={`floor-sign${live ? " is-live" : ""}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
      <rect className="floor-sign-board" x="-58" y="-32" width="116" height="52" rx="2" />
      <text className="floor-sign-index" x="0" y="-10">
        {String(index + 1).padStart(2, "0")}
      </text>
      <text className="floor-sign-name" x="0" y="8">
        {room.label}
      </text>
      <text className="floor-sign-time" x="0" y="22">
        {time}
      </text>
    </g>
  );
}

function FlowArrow({ x, y }: { x: number; y: number }) {
  const a = iso(x, y, 3);
  const b = iso(x + 28, y, 3);
  const tip = iso(x + 36, y, 3);
  const left = iso(x + 26, y - 8, 3);
  const right = iso(x + 26, y + 8, 3);
  return (
    <g className="floor-arrow" aria-hidden="true">
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
      <polygon points={pts([tip, left, right])} />
    </g>
  );
}

function BayNumber({ room, index }: { room: (typeof floorRooms)[number]; index: number }) {
  const p = iso(room.x + room.w / 2, room.y + 118, 1);
  return (
    <text className="floor-mark" x={p.x} y={p.y} textAnchor="middle">
      {String(index + 1).padStart(2, "0")}
    </text>
  );
}

const ROOM_ORDER: Zone[] = ["ops", "intake", "bullpen", "shop", "dock", "close"];

function roomByZone(zone: Zone) {
  return floorRooms.find((room) => room.zone === zone)!;
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
  const pin = iso(dayCards[Math.max(0, active)].focus.x, dayCards[Math.max(0, active)].focus.y, 36);
  const pathPts = floorRooms.map((room) => iso(room.x + room.w / 2, AISLE_Y + AISLE_D / 2, 4));
  const start = iso(-36, AISLE_Y + AISLE_D / 2, 4);
  const end = iso(BUILDING.w + 36, AISLE_Y + AISLE_D / 2, 4);
  const pathD = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} L ${pathPts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")} L ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
  const morning = iso(-8, AISLE_Y + AISLE_D / 2, 18);
  const evening = iso(BUILDING.w + 8, AISLE_Y + AISLE_D / 2, 18);

  return (
    <svg
      className="floor-svg"
      viewBox="-80 20 1760 820"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Cutaway of a shop floor. Six stations sit on one line of work, from 7 AM to 6 PM."
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

      <rect x="-80" y="20" width="1760" height="820" fill="url(#iso-sky)" />

      <g className="iso-ground" filter="url(#iso-drop)" aria-hidden="true">
        <IsoFloor className="iso-lot" x={-64} y={-48} w={BUILDING.w + 160} d={BUILDING.d + 120} />
      </g>

      <IsoFloor className="iso-hall" x={0} y={0} w={BUILDING.w} d={BUILDING.d} />
      <IsoWallNorth x={0} y={0} w={BUILDING.w} />
      <IsoWallWest x={0} y={0} d={BUILDING.d} />
      {floorRooms.map((room) => (
        <IsoWindow key={`win-${room.zone}`} x={room.x + 48} w={120} />
      ))}

      {ROOM_ORDER.map((zone) => {
        const room = roomByZone(zone);
        const index = floorRooms.findIndex((item) => item.zone === zone);
        const live = !allLit && !overview && liveZone === zone;
        const visited = allLit || (!overview && index <= active);
        const isFinale = zone === "close" && (allLit || (!overview && index <= active));
        return (
          <g
            key={zone}
            className={`floor-room${live ? " is-live" : ""}${visited ? " is-visited" : ""}${isFinale ? " is-finale" : ""}`}
            data-zone={zone}
          >
            <IsoFloor className="iso-slab" x={room.x} y={room.y} w={room.w} d={room.h} />
            <IsoFloor className="floor-bloom" x={room.x + 10} y={room.y + 10} w={room.w - 20} d={room.h - 20} z={1} />
            {index > 0 ? <IsoWallWest x={room.x} y={room.y} d={room.h} h={36} className="iso-west iso-partition" /> : null}
            <BayNumber room={room} index={index} />
            <g className="floor-room-detail is-on">
              <BayGear zone={zone} />
            </g>
          </g>
        );
      })}

      <IsoFloor className="iso-aisle" x={0} y={AISLE_Y} w={BUILDING.w} d={AISLE_D} z={1} />
      {floorRooms.slice(0, -1).map((room) => (
        <FlowArrow key={`arrow-${room.zone}`} x={room.x + room.w - 18} y={AISLE_Y + AISLE_D / 2} />
      ))}

      <path className="floor-path-ghost" d={pathD} />
      <path className="floor-path-shadow" d={pathD} />
      <path data-line="true" pathLength={1} className="floor-path" d={pathD} />
      <circle data-traveler="true" className="floor-traveler" r="8" cx={pathPts[0].x} cy={pathPts[0].y} />

      <text className="floor-endcap" x={morning.x} y={morning.y} textAnchor="end">
        7 AM · in
      </text>
      <text className="floor-endcap is-out" x={evening.x} y={evening.y} textAnchor="start">
        out · 6 PM
      </text>

      {floorRooms.map((room, index) => (
        <StationSign
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
