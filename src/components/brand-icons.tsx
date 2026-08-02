import type { LucideProps } from "lucide-react";

/**
 * Hand-drawn line icons for concepts lucide does not cover.
 * They follow the lucide grid (24×24, 2px stroke, round caps) so they sit
 * beside the rest of the icon set without looking out of place.
 */

type BrandIconProps = LucideProps;

function Svg({
  size = 24,
  strokeWidth = 2,
  absoluteStrokeWidth,
  children,
  ...rest
}: BrandIconProps & { children: React.ReactNode }) {
  void absoluteStrokeWidth;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

/** The Ka'bah, drawn as an isometric cube wrapped by the kiswah band. */
export function Kaaba(props: BrandIconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5 21 6.8l-9 4.3-9-4.3 9-4.3Z" />
      <path d="M3 6.8v10.4L12 21.5V11.1" />
      <path d="M21 6.8v10.4L12 21.5" />
      <path d="M3 10.2 12 14.5l9-4.3" />
    </Svg>
  );
}

/** A domed mosque with a mihrab doorway. */
export function Mosque(props: BrandIconProps) {
  return (
    <Svg {...props}>
      <path d="M3 21h18" />
      <path d="M5 21v-7.5a7 7 0 0 1 14 0V21" />
      <path d="M12 6.5V3" />
      <path d="M10 21v-3.5a2 2 0 0 1 4 0V21" />
    </Svg>
  );
}

/** Tasbih — a ring of beads with a tassel. */
export function PrayerBeads(props: BrandIconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="9.5" r="6.5" strokeDasharray="0.6 2.8" />
      <path d="M12 16v4.5" />
      <path d="M10.4 20.5h3.2" />
    </Svg>
  );
}

/** Prayer mat with a woven mihrab arch. */
export function PrayerMat(props: BrandIconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="2.5" width="14" height="19" rx="1.5" />
      <path d="M8.5 18v-5.5a3.5 3.5 0 0 1 7 0V18" />
      <path d="M5 6.5h14" />
      <path d="M5 18h14" />
    </Svg>
  );
}

/** Ramadan-style lantern, used as a decorative accent. */
export function Lantern(props: BrandIconProps) {
  return (
    <Svg {...props}>
      <path d="M9.5 2.5h5" />
      <path d="M12 2.5v2" />
      <path d="M8 8.5h8" />
      <path d="M9 4.5h6l1 4H8l1-4Z" />
      <path d="M8 8.5v7a4 4 0 0 0 8 0v-7" />
      <path d="M10 21.5h4" />
      <path d="M12 19.5v2" />
    </Svg>
  );
}

/** The HajjPath monogram: a path winding toward the Ka'bah. */
export function HajjPathMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="HajjPath"
    >
      <defs>
        <linearGradient id="hp-mark-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a5c31" />
          <stop offset="100%" stopColor="#012f17" />
        </linearGradient>
        <linearGradient id="hp-mark-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ecc95c" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#hp-mark-a)" />
      <path
        d="M11 39c0-8.5 4.6-12.2 10.4-14.6"
        stroke="url(#hp-mark-b)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M24 9.5 34.5 15v11L24 31.5 13.5 26V15L24 9.5Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.4"
      />
      <path d="M24 13.5 31.5 17 24 20.6 16.5 17 24 13.5Z" fill="url(#hp-mark-b)" />
      <path d="M16.5 17v7.6L24 28.3V20.6L16.5 17Z" fill="#ffffff" fillOpacity="0.9" />
      <path d="M31.5 17v7.6L24 28.3V20.6L31.5 17Z" fill="#ffffff" fillOpacity="0.6" />
    </svg>
  );
}
