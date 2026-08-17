import { dayCards } from "../content";

type Zone = (typeof dayCards)[number]["zone"];

const OX = 780;
const OY = 108;
const SX = 0.86;
const SY = 0.48;
const WALL = 76;

export const FLOOR = {
  width: 1680,
  height: 920,
} as const;

export function iso(x: number, y: number, z = 0) {
  return { x: OX + (x - y) * SX, y: OY + (x + y) * SY - z };
}

export const floorRooms: { zone: Zone; label: string; x: number; y: number; w: number; h: number }[] = [
  { zone: "ops", label: "Front office", x: 0, y: 0, w: 240, h: 200 },
  { zone: "intake", label: "Order desk", x: 240, y: 0, w: 320, h: 200 },
  { zone: "bullpen", label: "Bullpen", x: 0, y: 200, w: 240, h: 200 },
  { zone: "shop", label: "Shop floor", x: 240, y: 200, w: 320, h: 200 },
  { zone: "dock", label: "Warehouse & dock", x: 560, y: 0, w: 360, h: 400 },
  { zone: "close", label: "Close-out", x: 0, y: 400, w: 920, h: 160 },
];

export function roomCenter(room: (typeof floorRooms)[number]) {
  return iso(room.x + room.w / 2, room.y + room.h / 2, 28);
}

function pts(list: { x: number; y: number }[]) {
  return list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function IsoFloor({ x, y, w, d, z = 0, className }: { x: number; y: number; w: number; d: number; z?: number; className?: string }) {
  return (
    <polygon
      className={className}
      points={pts([iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)])}
    />
  );
}

function IsoWallWest({ x, y, d, h = WALL }: { x: number; y: number; d: number; h?: number }) {
  return (
    <polygon
      className="iso-west"
      points={pts([iso(x, y, 0), iso(x, y + d, 0), iso(x, y + d, h), iso(x, y, h)])}
    />
  );
}

function IsoWallNorth({ x, y, w, h = WALL }: { x: number; y: number; w: number; h?: number }) {
  return (
    <polygon
      className="iso-north"
      points={pts([iso(x, y, 0), iso(x + w, y, 0), iso(x + w, y, h), iso(x, y, h)])}
    />
  );
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

function IsoPerson({ x, y, tone = "ink" }: { x: number; y: number; tone?: "ink" | "brick" | "green" | "ochre" }) {
  const feet = iso(x, y, 0);
  const head = iso(x, y, 38);
  const chest = iso(x, y, 18);
  return (
    <g className={`floor-life floor-person is-${tone}`}>
      <ellipse cx={feet.x} cy={feet.y + 4} rx="10" ry="6" className="iso-shadow" />
      <polygon
        className="iso-body"
        points={pts([
          iso(x - 6, y, 8),
          iso(x + 6, y, 8),
          iso(x + 5, y, 28),
          iso(x - 5, y, 28),
        ])}
      />
      <circle cx={chest.x} cy={chest.y} r="5.5" />
      <circle cx={head.x} cy={head.y} r="7" />
    </g>
  );
}

function IsoLabel({ x, y, children }: { x: number; y: number; children: string }) {
  const p = iso(x, y, WALL + 10);
  return (
    <text className="floor-label" x={p.x} y={p.y}>
      {children}
    </text>
  );
}

function IsoNote({ x, y, children }: { x: number; y: number; children: string }) {
  const p = iso(x, y, 6);
  return (
    <text className="floor-note" x={p.x} y={p.y}>
      {children}
    </text>
  );
}

function RoomInterior({ zone, on }: { zone: Zone; on: boolean }) {
  return (
    <g className={`floor-room-detail${on ? " is-on" : ""}`} data-detail={zone}>
      {zone === "ops" ? (
        <>
          <IsoBox x={40} y={40} w={70} d={42} h={16} tone="wood" />
          <IsoBox x={52} y={48} w={22} d={10} h={14} z={16} tone="ink" />
          <IsoBox x={140} y={40} w={70} d={42} h={16} tone="wood" />
          <IsoBox x={152} y={48} w={22} d={10} h={14} z={16} tone="ink" />
          <IsoPerson x={74} y={108} tone="brick" />
          <IsoPerson x={174} y={108} tone="green" />
          <IsoNote x={28} y={168}>Three screens · one floor</IsoNote>
        </>
      ) : null}
      {zone === "intake" ? (
        <>
          <IsoBox x={270} y={36} w={180} d={36} h={20} tone="wood" />
          <IsoBox x={286} y={42} w={28} d={18} h={4} z={20} tone="ochre" />
          <IsoBox x={324} y={42} w={28} d={18} h={4} z={20} tone="ochre" />
          <IsoBox x={362} y={42} w={28} d={18} h={4} z={20} tone="brick" />
          <IsoBox x={480} y={70} w={48} d={48} h={40} tone="ink" />
          <IsoPerson x={340} y={110} tone="ochre" />
          <IsoPerson x={400} y={28} tone="brick" />
          <IsoNote x={260} y={168}>Quote · ticket · invoice</IsoNote>
        </>
      ) : null}
      {zone === "bullpen" ? (
        <>
          <IsoBox x={36} y={236} w={62} d={38} h={16} tone="wood" />
          <IsoBox x={132} y={236} w={62} d={38} h={16} tone="wood" />
          <IsoBox x={36} y={312} w={62} d={38} h={16} tone="wood" />
          <IsoBox x={132} y={312} w={62} d={38} h={16} tone="wood" />
          <IsoBox x={168} y={318} w={22} d={14} h={6} z={16} tone="brick" />
          <IsoPerson x={66} y={292} tone="green" />
          <IsoPerson x={178} y={348} tone="brick" />
          <IsoNote x={24} y={372}>One name on the job</IsoNote>
        </>
      ) : null}
      {zone === "shop" ? (
        <>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <IsoBox x={268 + i * 72} y={248} w={56} d={56} h={22} tone="green" />
              <IsoBox x={282 + i * 72} y={262} w={28} d={28} h={16} z={22} tone="ochre" />
            </g>
          ))}
          <IsoPerson x={296} y={340} tone="brick" />
          <IsoPerson x={368} y={340} tone="green" />
          <IsoPerson x={440} y={340} tone="ochre" />
          <IsoNote x={260} y={372}>Four cells · one way</IsoNote>
        </>
      ) : null}
      {zone === "dock" ? (
        <>
          {[0, 1, 2, 3].map((col) => (
            <IsoBox key={col} x={590 + col * 72} y={36} w={48} d={150} h={58} tone="wood" />
          ))}
          <IsoBox x={600} y={220} w={36} d={28} h={14} tone="wood" />
          <IsoBox x={660} y={220} w={36} d={28} h={14} tone="alert" />
          <IsoBox x={880} y={150} w={52} d={120} h={34} tone="ink" />
          <IsoBox x={894} y={164} w={28} d={40} h={22} z={34} tone="brick" />
          <IsoPerson x={780} y={250} tone="brick" />
          <IsoNote x={580} y={372}>Flagged before the truck</IsoNote>
        </>
      ) : null}
      {zone === "close" ? (
        <>
          <IsoBox x={40} y={430} w={110} d={58} h={20} tone="ink" />
          <IsoBox x={56} y={442} w={12} d={12} h={22} z={20} tone="ochre" />
          <IsoBox x={76} y={438} w={12} d={12} h={30} z={20} tone="ochre" />
          <IsoBox x={96} y={444} w={12} d={12} h={18} z={20} tone="ochre" />
          <IsoBox x={116} y={436} w={12} d={12} h={34} z={20} tone="ochre" />
          <IsoBox x={640} y={436} w={80} d={44} h={16} tone="wood" />
          <IsoPerson x={96} y={510} tone="green" />
          <IsoPerson x={680} y={500} tone="ochre" />
          <IsoNote x={28} y={532}>Leave with the numbers</IsoNote>
        </>
      ) : null}
    </g>
  );
}

const ROOM_ORDER: Zone[] = ["ops", "intake", "bullpen", "shop", "dock", "close"];

function roomByZone(zone: Zone) {
  return floorRooms.find((room) => room.zone === zone)!;
}

export function FloorPlan({
  active,
  allLit,
}: {
  active: number;
  allLit?: boolean;
}) {
  const liveZone = dayCards[active].zone;
  const pin = iso(dayCards[active].focus.x, dayCards[active].focus.y, 44);
  const pathPts = [
    iso(120, 90, 8),
    iso(400, 90, 8),
    iso(120, 300, 8),
    iso(400, 300, 8),
    iso(740, 180, 8),
    iso(460, 480, 8),
  ];

  return (
    <svg
      className="floor-svg"
      viewBox="220 0 1460 920"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Isometric cutaway of a working building. Rooms rise and light up through the day."
    >
      <defs>
        <linearGradient id="iso-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7d7a8" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#efeae0" stopOpacity="0" />
        </linearGradient>
        <filter id="floor-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="iso-drop">
          <feDropShadow dx="8" dy="14" stdDeviation="10" floodColor="#171916" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect x="220" y="0" width="1460" height="920" fill="url(#iso-sky)" />

      <g className="iso-ground" filter="url(#iso-drop)" aria-hidden="true">
        <IsoFloor className="iso-lot" x={-48} y={-40} w={1040} d={680} />
      </g>

      {ROOM_ORDER.map((zone) => {
        const room = roomByZone(zone);
        const index = floorRooms.findIndex((item) => item.zone === zone);
        const live = !allLit && liveZone === zone;
        const visited = allLit || index <= active;
        const isFinale = zone === "close";
        return (
          <g
            key={zone}
            className={`floor-room${live ? " is-live" : ""}${visited ? " is-visited" : ""}${isFinale ? " is-finale" : ""}`}
            data-zone={zone}
          >
            <IsoFloor className="iso-slab" x={room.x} y={room.y} w={room.w} d={room.h} />
            <IsoFloor className="floor-bloom" x={room.x + 8} y={room.y + 8} w={room.w - 16} d={room.h - 16} z={1} />
            <IsoWallWest x={room.x} y={room.y} d={room.h} />
            <IsoWallNorth x={room.x} y={room.y} w={room.w} />
            <IsoLabel x={room.x + 18} y={room.y + 22}>
              {`${String(index + 1).padStart(2, "0")} · ${room.label}`}
            </IsoLabel>
            <RoomInterior zone={zone} on={allLit || index <= active} />
          </g>
        );
      })}

      <path
        className="floor-path-shadow"
        d={`M ${pathPts[0].x} ${pathPts[0].y + 10} L ${pathPts.map((p) => `${p.x} ${p.y + 10}`).join(" L ")}`}
      />
      <path
        data-line="true"
        pathLength={1}
        className="floor-path"
        d={`M ${pathPts[0].x} ${pathPts[0].y} C ${pathPts[1].x} ${pathPts[0].y}, ${pathPts[1].x} ${pathPts[1].y}, ${pathPts[1].x} ${pathPts[1].y} S ${pathPts[2].x} ${pathPts[2].y}, ${pathPts[2].x} ${pathPts[2].y} S ${pathPts[3].x} ${pathPts[3].y}, ${pathPts[3].x} ${pathPts[3].y} S ${pathPts[4].x} ${pathPts[4].y}, ${pathPts[4].x} ${pathPts[4].y} S ${pathPts[5].x} ${pathPts[5].y}, ${pathPts[5].x} ${pathPts[5].y}`}
      />
      <circle data-traveler="true" className="floor-traveler" r="7" cx={pathPts[0].x} cy={pathPts[0].y} />

      <g
        className={`floor-pin${dayCards[active].zone === "close" ? " is-finale" : ""}`}
        style={{ transform: `translate(${pin.x}px, ${pin.y}px)` }}
        aria-hidden="true"
      >
        <circle className="floor-pin-pulse" r="28" />
        <circle className="floor-pin-ring" r="12" fill="none" />
        <circle r="5.5" />
        <text className="floor-pin-time" y="-34" textAnchor="middle">
          {dayCards[active].time}
        </text>
      </g>
    </svg>
  );
}
