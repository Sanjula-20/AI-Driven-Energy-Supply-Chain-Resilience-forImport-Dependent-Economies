import { useMemo, useState } from 'react';
import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import { LoadingState, ErrorState } from '../components/States';
import { riskColor } from '../utils/risk';

const VIEW_W = 1000;
const VIEW_H = 500;

// Simple equirectangular projection: lng [-180,180] -> x [0,VIEW_W], lat [90,-90] -> y [0,VIEW_H]
function project({ lat, lng }) {
  const x = ((lng + 180) / 360) * VIEW_W;
  const y = ((90 - lat) / 180) * VIEW_H;
  return { x, y };
}

const INDIA = { lat: 21.0, lng: 79.0 };
const INDIAN_PORTS = [
  { name: 'Jamnagar', lat: 22.47, lng: 70.06 },
  { name: 'Paradip', lat: 20.26, lng: 86.67 },
  { name: 'Kochi', lat: 9.93, lng: 76.26 },
  { name: 'Vizag', lat: 17.68, lng: 83.22 },
];

export default function SupplyChainMap() {
  const { data: suppliersData, loading: l1, error: e1, refetch: refetchSuppliers } = useApiData('/suppliers');
  const { data: corridorsData, loading: l2, error: e2, refetch: refetchCorridors } = useApiData('/corridors');
  const [hovered, setHovered] = useState(null);

  const loading = l1 || l2;
  const error = e1 || e2;

  const indiaXY = project(INDIA);

  const suppliers = useMemo(() => suppliersData?.suppliers || [], [suppliersData]);
  const corridors = useMemo(() => corridorsData?.corridors || [], [corridorsData]);

  return (
    <div>
      <PageHeader
        title="Supply Chain Map"
        subtitle="Stylized plotting board of supplier origins, Indian import terminals, and the four shipping corridors carrying crude oil to India. Positions use demo/approximate geographic coordinates."
      />

      {loading && <LoadingState label="Plotting supply chain…" />}
      {error && <ErrorState message={error} onRetry={() => { refetchSuppliers(); refetchCorridors(); }} />}

      {!loading && !error && (
        <Panel eyebrow="Command Board" title="Global Supplier & Corridor Overview">
          <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: 'auto', background: 'var(--bg-void)', borderRadius: 12 }}>
              {/* Radar grid background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" />
              {/* Equator + reference lines */}
              <line x1="0" y1={VIEW_H / 2} x2={VIEW_W} y2={VIEW_H / 2} stroke="var(--border-strong)" strokeWidth="0.8" strokeDasharray="4 4" />
              <line x1={VIEW_W / 2} y1="0" x2={VIEW_W / 2} y2={VIEW_H} stroke="var(--border-strong)" strokeWidth="0.8" strokeDasharray="4 4" />

              {/* Corridor paths */}
              {corridors.map((c) => {
                if (!c.path || c.path.length < 2) return null;
                const pts = c.path.map((p) => project(p));
                const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const color = riskColor(c.riskLevel);
                const isHovered = hovered === `corridor-${c.code}`;
                return (
                  <g key={c.code}>
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHovered ? 3.5 : 2}
                      strokeLinecap="round"
                      strokeDasharray={c.currentStatus === 'NORMAL' ? 'none' : '6 4'}
                      opacity={isHovered ? 1 : 0.75}
                      onMouseEnter={() => setHovered(`corridor-${c.code}`)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: 'pointer' }}
                    />
                    {/* connect corridor midpoint to India for readability */}
                    <line
                      x1={pts[pts.length - 1].x}
                      y1={pts[pts.length - 1].y}
                      x2={indiaXY.x}
                      y2={indiaXY.y}
                      stroke={color}
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      opacity="0.35"
                    />
                  </g>
                );
              })}

              {/* India marker */}
              <g onMouseEnter={() => setHovered('india')} onMouseLeave={() => setHovered(null)}>
                <circle cx={indiaXY.x} cy={indiaXY.y} r={hovered === 'india' ? 9 : 7} fill="var(--accent-signal)" stroke="var(--bg-void)" strokeWidth="2" />
                <text x={indiaXY.x} y={indiaXY.y - 14} textAnchor="middle" fill="var(--text-primary)" fontFamily="var(--font-display)" fontSize="13" fontWeight="700">
                  INDIA
                </text>
              </g>

              {/* Indian ports */}
              {INDIAN_PORTS.map((port) => {
                const p = project(port);
                return (
                  <g key={port.name}>
                    <circle cx={p.x} cy={p.y} r="3" fill="var(--text-secondary)" />
                    <text x={p.x + 6} y={p.y + 3} fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
                      {port.name}
                    </text>
                  </g>
                );
              })}

              {/* Supplier markers */}
              {suppliers.map((s) => {
                const p = project(s.coordinates);
                const color = riskColor(scoreToLevel(s.riskScore));
                const isHovered = hovered === `supplier-${s._id}`;
                return (
                  <g
                    key={s._id}
                    onMouseEnter={() => setHovered(`supplier-${s._id}`)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={p.x} cy={p.y} r={isHovered ? 10 : 8} fill={color} opacity="0.25" />
                    <circle cx={p.x} cy={p.y} r={isHovered ? 6 : 5} fill={color} stroke="var(--bg-void)" strokeWidth="1.5" />
                    {isHovered && (
                      <text x={p.x} y={p.y - 14} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)">
                        {s.name} · {s.riskScore}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div style={{ display: 'flex', gap: 18, marginTop: 14, flexWrap: 'wrap', fontSize: 12 }}>
              <LegendDot color="var(--accent-signal)" label="India" />
              <LegendDot color="var(--risk-low)" label="Low risk" />
              <LegendDot color="var(--risk-medium)" label="Medium risk" />
              <LegendDot color="var(--risk-high)" label="High risk" />
              <LegendDot color="var(--risk-critical)" label="Critical risk" />
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

function scoreToLevel(score) {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      {label}
    </span>
  );
}
