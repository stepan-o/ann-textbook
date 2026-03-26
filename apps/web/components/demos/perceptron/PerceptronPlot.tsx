import type { PerceptronResponse } from "@/lib/types/perceptron";

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 520;
const MARGIN = { top: 36, right: 32, bottom: 58, left: 58 };
const DOMAIN_MIN = -0.2;
const DOMAIN_MAX = 1.2;
const EPSILON = 1e-6;

type BoundarySegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function scaleX(value: number) {
  const width = VIEWBOX_WIDTH - MARGIN.left - MARGIN.right;
  return (
    MARGIN.left +
    ((value - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * width
  );
}

function scaleY(value: number) {
  const height = VIEWBOX_HEIGHT - MARGIN.top - MARGIN.bottom;
  return (
    MARGIN.top +
    (1 - (value - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * height
  );
}

function withinDomain(value: number) {
  return value >= DOMAIN_MIN - EPSILON && value <= DOMAIN_MAX + EPSILON;
}

function dedupePoints(points: Array<{ x: number; y: number }>) {
  return points.filter((point, index) => {
    return !points.slice(0, index).some((candidate) => {
      return (
        Math.abs(candidate.x - point.x) < EPSILON &&
        Math.abs(candidate.y - point.y) < EPSILON
      );
    });
  });
}

function getBoundarySegment(
  w1: number,
  w2: number,
  b: number,
): BoundarySegment | null {
  if (Math.abs(w1) < EPSILON && Math.abs(w2) < EPSILON) {
    return null;
  }

  if (Math.abs(w2) < EPSILON) {
    const x = -b / w1;
    if (!withinDomain(x)) {
      return null;
    }

    return {
      x1: x,
      y1: DOMAIN_MIN,
      x2: x,
      y2: DOMAIN_MAX,
    };
  }

  const candidates: Array<{ x: number; y: number }> = [];

  const yAtMinX = -(w1 * DOMAIN_MIN + b) / w2;
  if (withinDomain(yAtMinX)) {
    candidates.push({ x: DOMAIN_MIN, y: yAtMinX });
  }

  const yAtMaxX = -(w1 * DOMAIN_MAX + b) / w2;
  if (withinDomain(yAtMaxX)) {
    candidates.push({ x: DOMAIN_MAX, y: yAtMaxX });
  }

  if (Math.abs(w1) >= EPSILON) {
    const xAtMinY = -(w2 * DOMAIN_MIN + b) / w1;
    if (withinDomain(xAtMinY)) {
      candidates.push({ x: xAtMinY, y: DOMAIN_MIN });
    }

    const xAtMaxY = -(w2 * DOMAIN_MAX + b) / w1;
    if (withinDomain(xAtMaxY)) {
      candidates.push({ x: xAtMaxY, y: DOMAIN_MAX });
    }
  }

  const points = dedupePoints(candidates);
  if (points.length < 2) {
    return null;
  }

  let bestPair: BoundarySegment | null = null;
  let bestDistance = -1;

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = dx * dx + dy * dy;

      if (distance > bestDistance) {
        bestDistance = distance;
        bestPair = {
          x1: points[i].x,
          y1: points[i].y,
          x2: points[j].x,
          y2: points[j].y,
        };
      }
    }
  }

  return bestPair;
}

function getTrueLabelColor(label: number) {
  return label === 1 ? "#22d3ee" : "#f97316";
}

function getPredictedStroke(pred: number) {
  return pred === 1 ? "#67e8f9" : "#fdba74";
}

export function PerceptronPlot({
  data,
}: {
  data: PerceptronResponse | null;
}) {
  const ticks = [0, 0.5, 1];
  const plotWidth = VIEWBOX_WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = VIEWBOX_HEIGHT - MARGIN.top - MARGIN.bottom;

  if (!data) {
    return (
      <div className="flex h-full min-h-[420px] flex-col rounded-2xl border border-dashed border-stone-700 bg-stone-950/50 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-stone-100">Loading plot</h2>
          <p className="max-w-xl text-sm leading-6 text-stone-300">
            Waiting for the first perceptron response from the backend.
          </p>
        </div>
      </div>
    );
  }

  const points = data.dataset.points.map((point, index) => ({
    ...point,
    pred: data.predictions[index]?.pred ?? 0,
  }));

  const boundary = getBoundarySegment(
    data.boundary.w1,
    data.boundary.w2,
    data.boundary.b,
  );

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-2xl border border-cyan-400/10 bg-stone-950/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-stone-100">Decision Space</h2>
          <p className="max-w-xl text-sm leading-6 text-stone-300">
            Fill color shows the true label. The outer ring shows the
            perceptron&apos;s current prediction.
          </p>
        </div>

        <div className="grid gap-2 text-xs text-stone-300 sm:grid-cols-2">
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
            Accuracy {(data.metrics.accuracy * 100).toFixed(0)}%
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
            Mistakes {data.metrics.mistakes}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-xs text-stone-300 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="font-medium text-stone-100">True label</p>
          <div className="mt-2 flex gap-4">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getTrueLabelColor(0) }}
              />
              0
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getTrueLabelColor(1) }}
              />
              1
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="font-medium text-stone-100">Predicted label ring</p>
          <div className="mt-2 flex gap-4">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border-[3px] bg-transparent"
                style={{ borderColor: getPredictedStroke(0) }}
              />
              0
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border-[3px] bg-transparent"
                style={{ borderColor: getPredictedStroke(1) }}
              />
              1
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-stone-800 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_30%),linear-gradient(180deg,_rgba(28,25,23,0.96),_rgba(12,10,9,0.96))]">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="h-full w-full"
          aria-label="Perceptron dataset plot"
        >
          <defs>
            <linearGradient
              id="boundary-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#f9a8d4" />
            </linearGradient>
            <filter id="boundary-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={plotWidth}
            height={plotHeight}
            rx="18"
            fill="rgba(12, 10, 9, 0.82)"
            stroke="rgba(255,255,255,0.08)"
          />

          {ticks.map((tick) => (
            <g key={`grid-x-${tick}`}>
              <line
                x1={scaleX(tick)}
                x2={scaleX(tick)}
                y1={MARGIN.top}
                y2={MARGIN.top + plotHeight}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="6 10"
              />
              <text
                x={scaleX(tick)}
                y={VIEWBOX_HEIGHT - 18}
                textAnchor="middle"
                fontSize="12"
                fill="#a8a29e"
              >
                {tick}
              </text>
            </g>
          ))}

          {ticks.map((tick) => (
            <g key={`grid-y-${tick}`}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + plotWidth}
                y1={scaleY(tick)}
                y2={scaleY(tick)}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="6 10"
              />
              <text
                x={24}
                y={scaleY(tick) + 4}
                textAnchor="middle"
                fontSize="12"
                fill="#a8a29e"
              >
                {tick}
              </text>
            </g>
          ))}

          <line
            x1={MARGIN.left}
            x2={MARGIN.left + plotWidth}
            y1={scaleY(0)}
            y2={scaleY(0)}
            stroke="rgba(255,255,255,0.2)"
          />
          <line
            x1={scaleX(0)}
            x2={scaleX(0)}
            y1={MARGIN.top}
            y2={MARGIN.top + plotHeight}
            stroke="rgba(255,255,255,0.2)"
          />

          <text
            x={MARGIN.left + plotWidth / 2}
            y={VIEWBOX_HEIGHT - 4}
            textAnchor="middle"
            fontSize="13"
            fill="#d6d3d1"
          >
            x1
          </text>
          <text
            x={18}
            y={MARGIN.top + plotHeight / 2}
            textAnchor="middle"
            fontSize="13"
            fill="#d6d3d1"
            transform={`rotate(-90 18 ${MARGIN.top + plotHeight / 2})`}
          >
            x2
          </text>

          {boundary ? (
            <>
              <line
                x1={scaleX(boundary.x1)}
                y1={scaleY(boundary.y1)}
                x2={scaleX(boundary.x2)}
                y2={scaleY(boundary.y2)}
                stroke="url(#boundary-gradient)"
                strokeWidth="10"
                opacity="0.22"
                filter="url(#boundary-glow)"
                strokeLinecap="round"
              />
              <line
                x1={scaleX(boundary.x1)}
                y1={scaleY(boundary.y1)}
                x2={scaleX(boundary.x2)}
                y2={scaleY(boundary.y2)}
                stroke="url(#boundary-gradient)"
                strokeWidth="3"
                strokeDasharray="10 8"
                strokeLinecap="round"
              />
            </>
          ) : (
            <text
              x={MARGIN.left + plotWidth / 2}
              y={MARGIN.top + 26}
              textAnchor="middle"
              fontSize="13"
              fill="#93c5fd"
            >
              Boundary becomes visible once the weights move away from zero.
            </text>
          )}

          {points.map((point) => {
            const mismatch = point.pred !== point.label;

            return (
              <g
                key={`${point.x1}-${point.x2}`}
                transform={`translate(${scaleX(point.x1)}, ${scaleY(point.x2)})`}
              >
                {mismatch ? (
                  <circle
                    r="22"
                    fill={getPredictedStroke(point.pred)}
                    opacity="0.14"
                  />
                ) : null}

                <circle
                  r="16"
                  fill={getTrueLabelColor(point.label)}
                  opacity="0.25"
                />
                <circle
                  r="11"
                  fill={getTrueLabelColor(point.label)}
                  stroke={getPredictedStroke(point.pred)}
                  strokeWidth="5"
                />

                {mismatch ? (
                  <path
                    d="M -5 -5 L 5 5 M 5 -5 L -5 5"
                    stroke="#fafaf9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                ) : null}

                <text
                  y="-22"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#e7e5e4"
                >
                  ({point.x1}, {point.x2})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-sm font-medium text-stone-100">Boundary equation</p>
        <p className="max-w-xl text-sm leading-6 text-stone-300">
          {Math.abs(data.boundary.w1) < EPSILON &&
          Math.abs(data.boundary.w2) < EPSILON
            ? "The model is still at the zero state, so there is no meaningful line to draw yet."
            : `${data.boundary.w1.toFixed(2)}·x1 + ${data.boundary.w2.toFixed(
                2,
              )}·x2 + ${data.boundary.b.toFixed(2)} = 0`}
        </p>
      </div>
    </div>
  );
}
