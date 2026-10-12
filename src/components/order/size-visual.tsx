/**
 * Container op schaal naast een persoon van 1,80 m, met maatlijnen in meters.
 * Alle formaten delen dezelfde schaal (viewBox in meters), zodat ze onderling
 * vergelijkbaar zijn en de container zichtbaar "groeit" bij een groter formaat.
 */
const GROUND = 2;
const WIDTH = 8;
const HEIGHT = 2.95;

const fmt = (n: number) => n.toLocaleString("nl-NL", { minimumFractionDigits: 1 });

export function SizeVisual({
  lengthM,
  heightM,
  className = "",
  showHeight = false,
}: {
  lengthM: number;
  heightM: number;
  className?: string;
  showHeight?: boolean;
}) {
  const x0 = 0.85;
  const x1 = x0 + lengthM;
  const top = GROUND - heightM;
  const slope = heightM * 0.35;
  const dimY = GROUND + 0.3;
  const ribCount = Math.max(2, Math.round(lengthM / 1.1));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Indicatief ca. ${fmt(lengthM)} m lang en ${fmt(heightM)} m hoog, naast een persoon van 1,80 m`}
      className={className}
    >
      {/* Persoon (1,80 m) */}
      <g className="fill-navy-200">
        <circle cx="0.36" cy="0.33" r="0.13" />
        <rect x="0.18" y="0.5" width="0.36" height="0.82" rx="0.12" />
        <rect x="0.22" y="1.2" width="0.13" height="0.8" rx="0.06" />
        <rect x="0.37" y="1.2" width="0.13" height="0.8" rx="0.06" />
      </g>

      {/* Container */}
      <g className="transition-transform duration-500">
        <polygon
          points={`${x0},${top} ${x1},${top} ${x1 - slope},${GROUND} ${x0 + slope},${GROUND}`}
          className="fill-navy-800"
        />
        {/* Ribben */}
        {Array.from({ length: ribCount }, (_, i) => {
          const x = x0 + slope + ((lengthM - 2 * slope) * (i + 1)) / (ribCount + 1);
          return (
            <rect key={i} x={x - 0.025} y={top + 0.14} width="0.05" height={heightM - 0.22} className="fill-navy-700" />
          );
        })}
        <rect x={x0 - 0.04} y={top - 0.02} width={lengthM + 0.08} height="0.12" rx="0.03" className="fill-accent-500" />
      </g>

      {/* Grond */}
      <rect x="0" y={GROUND} width={WIDTH} height="0.02" className="fill-navy-200" />

      {/* Maatlijn lengte */}
      <g className="fill-navy-500 stroke-navy-300" strokeWidth="0.02">
        <line x1={x0} y1={dimY} x2={x1} y2={dimY} />
        <line x1={x0} y1={dimY - 0.08} x2={x0} y2={dimY + 0.08} />
        <line x1={x1} y1={dimY - 0.08} x2={x1} y2={dimY + 0.08} />
        <text
          x={(x0 + x1) / 2}
          y={dimY + 0.48}
          textAnchor="middle"
          fontSize="0.42"
          fontWeight="700"
          stroke="none"
          className="fill-navy-700"
        >
          {fmt(lengthM)} m
        </text>
      </g>

      {/* Maatlijn hoogte */}
      {showHeight && (
        <g className="stroke-navy-300" strokeWidth="0.02">
          <line x1={x1 + 0.2} y1={top} x2={x1 + 0.2} y2={GROUND} />
          <line x1={x1 + 0.12} y1={top} x2={x1 + 0.28} y2={top} />
          <line x1={x1 + 0.12} y1={GROUND} x2={x1 + 0.28} y2={GROUND} />
          <text
            x={x1 + 0.34}
            y={(top + GROUND) / 2 + 0.14}
            fontSize="0.38"
            fontWeight="700"
            stroke="none"
            className="fill-navy-700"
          >
            {fmt(heightM)} m
          </text>
        </g>
      )}
    </svg>
  );
}
