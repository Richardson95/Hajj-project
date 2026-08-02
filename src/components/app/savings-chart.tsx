"use client";

import { useMemo } from "react";
import { compactNaira } from "@/lib/format";

export interface CurvePoint {
  label: string;
  actual: number | null;
  projected: number;
}

/**
 * Hand-rolled SVG area chart. Actual contributions are drawn solid, the
 * projection beyond today is dashed, and the goal line sits on top.
 */
export function SavingsChart({
  points,
  goal,
  height = 220,
}: {
  points: CurvePoint[];
  goal: number;
  height?: number;
}) {
  const width = 720;
  const padding = { top: 16, right: 16, bottom: 28, left: 52 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxValue = Math.max(goal, ...points.map((p) => p.projected)) * 1.06;

  const x = (i: number) =>
    padding.left + (i / Math.max(1, points.length - 1)) * innerW;
  const y = (value: number) =>
    padding.top + innerH - (value / maxValue) * innerH;

  const { actualPath, projectedPath, areaPath, todayIndex } = useMemo(() => {
    const lastActual = points.reduce(
      (acc, p, i) => (p.actual !== null ? i : acc),
      0,
    );

    const actualPts = points
      .slice(0, lastActual + 1)
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.actual ?? 0).toFixed(1)}`)
      .join(" ");

    const projectedPts = points
      .slice(lastActual)
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${x(lastActual + i).toFixed(1)},${y(p.projected).toFixed(1)}`,
      )
      .join(" ");

    const area = `${actualPts} L${x(lastActual).toFixed(1)},${(padding.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padding.top + innerH).toFixed(1)} Z`;

    return {
      actualPath: actualPts,
      projectedPath: projectedPts,
      areaPath: area,
      todayIndex: lastActual,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, maxValue, height]);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxValue);

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Savings progress and projection"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hp-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#014421" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#014421" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid + y axis */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-line"
              strokeWidth={1}
            />
            <text
              x={padding.left - 8}
              y={y(t) + 4}
              textAnchor="end"
              className="fill-current text-[11px] text-muted"
            >
              {compactNaira(t)}
            </text>
          </g>
        ))}

        {/* Goal line */}
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={y(goal)}
          y2={y(goal)}
          stroke="#c9a227"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text
          x={width - padding.right}
          y={y(goal) - 6}
          textAnchor="end"
          className="text-[11px] font-semibold"
          fill="#c9a227"
        >
          Goal {compactNaira(goal)}
        </text>

        {/* Area + lines */}
        <path d={areaPath} fill="url(#hp-area)" />
        <path
          d={actualPath}
          fill="none"
          stroke="#014421"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dark:stroke-emerald-400"
        />
        <path
          d={projectedPath}
          fill="none"
          stroke="#014421"
          strokeOpacity={0.45}
          strokeWidth={2}
          strokeDasharray="6 5"
          strokeLinecap="round"
          className="dark:stroke-emerald-400/50"
        />

        {/* Today marker */}
        <circle
          cx={x(todayIndex)}
          cy={y(points[todayIndex]?.actual ?? points[todayIndex]?.projected ?? 0)}
          r={5}
          fill="#014421"
          stroke="#ffffff"
          strokeWidth={2.5}
          className="dark:fill-emerald-400"
        />

        {/* X axis labels */}
        {points.map((p, i) =>
          i % 2 === 0 ? (
            <text
              key={i}
              x={x(i)}
              y={height - 8}
              textAnchor="middle"
              className="fill-current text-[11px] text-muted"
            >
              {p.label}
            </text>
          ) : null,
        )}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded-full bg-forest-800 dark:bg-emerald-400" />
          Contributions to date
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded-full bg-forest-800/45 dark:bg-emerald-400/50" />
          Projection at current plan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded-full bg-gold-500" />
          Goal
        </span>
      </div>
    </div>
  );
}
