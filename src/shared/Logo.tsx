type MarkProps = {
  className?: string;
};

/** The mark's geometry, in a 128 × 104 box: the f, then four blades rotated about (46, 100). */
export const FAN_F = "M18 100 V38 C18 19.9 29.9 8 48 8 h9 v16 h-7 c-9.1 0 -14 4.9 -14 14 v7 h21 v15 H36 v40 Z";
export const FAN_BLADE =
  "M60 93.6 Q57.6 94 57.6 96.4 L57.6 97.6 Q57.6 100 60 100 L114 100 Q120 100 120 94 L120 91.4 Q120 85.6 114.2 86.8 Z";
export const FAN_BLADE_ROTATIONS = [0, -16, -32, -48] as const;

/** The fanworks mark: a lowercase f with four fan blades opening from its foot. */
export function FanMark({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 128 104" fill="currentColor" aria-hidden="true">
      <path d={FAN_F} />
      {FAN_BLADE_ROTATIONS.map((deg) => (
        <path key={deg} d={FAN_BLADE} transform={deg ? `rotate(${deg} 46 100)` : undefined} />
      ))}
    </svg>
  );
}

type LockupProps = {
  compact?: boolean;
};

/** Full brand lockup: mark, lowercase wordmark, and letterspaced tagline. */
export function Lockup({ compact = false }: LockupProps) {
  return (
    <span className={`lockup${compact ? " lockup-compact" : ""}`}>
      <FanMark className="lockup-mark" />
      <span className="lockup-text">
        <span className="lockup-name">fanworks</span>
        <span className="lockup-tag">HCD Business Consulting</span>
      </span>
    </span>
  );
}
