export interface LineChartProps {
  values: number[];
  width: number;
  height: number;
  color: string;
  decimalPlaces?: number;
  showAllLabels?: boolean;
  labelStep?: number;
  withOuterLines?: boolean;
  withVerticalLines?: boolean;
}

const MARGIN = { top: 20, right: 14, bottom: 28, left: 46 };
const GRID_LINES = 4;

function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * Gráfica de líneas con suavizado bezier, replicando el estilo de
 * react-native-chart-kit (LineChart + bezier) usado en la app original.
 */
export default function LineChart({
  values,
  width,
  height,
  color,
  decimalPlaces = 1,
  showAllLabels = false,
  labelStep,
  withOuterLines = false,
  withVerticalLines = false,
}: LineChartProps) {
  if (values.length === 0) return null;

  const plotWidth = width - MARGIN.left - MARGIN.right;
  const plotHeight = height - MARGIN.top - MARGIN.bottom;

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const rawRange = dataMax - dataMin || Math.abs(dataMax) || 1;
  const yMin = dataMin - rawRange * 0.15;
  const yMax = dataMax + rawRange * 0.15;
  const yRange = yMax - yMin;

  const stepX = values.length > 1 ? plotWidth / (values.length - 1) : 0;
  const points = values.map((value, index) => ({
    x: MARGIN.left + index * stepX,
    y: MARGIN.top + plotHeight - ((value - yMin) / yRange) * plotHeight,
  }));

  const path = smoothPath(points);

  const gridValues = Array.from({ length: GRID_LINES + 1 }, (_, i) => {
    const ratio = i / GRID_LINES;
    return {
      value: yMax - ratio * yRange,
      y: MARGIN.top + ratio * plotHeight,
    };
  });

  const step =
    labelStep ??
    (values.length <= 10 ? 1 : Math.ceil(values.length / 8));

  const xLabels = values
    .map((_, index) => ({ index, x: points[index].x }))
    .filter(
      ({ index }) =>
        showAllLabels || index % step === 0 || index === values.length - 1,
    );

  const outerTop = withOuterLines ? MARGIN.top : null;
  const outerBottom = withOuterLines ? MARGIN.top + plotHeight : null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="line-chart"
      role="img"
    >
      {/* Líneas horizontales de la cuadrícula */}
      {gridValues.map((line, i) => (
        <g key={`h-${i}`}>
          <line
            x1={MARGIN.left}
            x2={width - MARGIN.right}
            y1={line.y}
            y2={line.y}
            stroke="var(--outline-variant)"
            strokeWidth={1}
            opacity={0.7}
          />
          <text
            x={MARGIN.left - 8}
            y={line.y + 3}
            textAnchor="end"
            className="line-chart__axis-label"
          >
            {line.value.toFixed(decimalPlaces)}
          </text>
        </g>
      ))}

      {/* Línea exterior superior/inferior (withOuterLines) */}
      {outerTop !== null && (
        <line
          x1={MARGIN.left}
          x2={width - MARGIN.right}
          y1={outerTop}
          y2={outerTop}
          stroke="var(--outline-variant)"
          strokeWidth={1}
          opacity={0.7}
        />
      )}
      {outerBottom !== null && (
        <line
          x1={MARGIN.left}
          x2={width - MARGIN.right}
          y1={outerBottom}
          y2={outerBottom}
          stroke="var(--outline-variant)"
          strokeWidth={1}
          opacity={0.7}
        />
      )}

      {/* Líneas verticales (solo en la vista detallada) */}
      {withVerticalLines &&
        points.map((point, i) => (
          <line
            key={`v-${i}`}
            x1={point.x}
            x2={point.x}
            y1={MARGIN.top}
            y2={MARGIN.top + plotHeight}
            stroke="var(--outline-variant)"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}

      {/* Eje X: línea inferior */}
      <line
        x1={MARGIN.left}
        x2={width - MARGIN.right}
        y1={MARGIN.top + plotHeight}
        y2={MARGIN.top + plotHeight}
        stroke="var(--outline-variant)"
        strokeWidth={1}
      />

      {/* Curva */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Puntos */}
      {points.map((point, i) => (
        <circle
          key={`dot-${i}`}
          cx={point.x}
          cy={point.y}
          r={4}
          fill={color}
          stroke={color}
          strokeWidth={2}
        />
      ))}

      {/* Etiquetas del eje X (índices, como en la app original) */}
      {xLabels.map(({ index, x }) => (
        <text
          key={`xl-${index}`}
          x={x}
          y={height - 8}
          textAnchor="middle"
          className="line-chart__axis-label"
        >
          {index + 1}
        </text>
      ))}
    </svg>
  );
}
