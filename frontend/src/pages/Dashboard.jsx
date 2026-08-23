import { useMemo } from 'react';
import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import StatCard from '../components/StatCard';
import RiskRing from '../components/RiskRing';
import Badge from '../components/Badge';
import { LoadingState, ErrorState } from '../components/States';
import { formatNumber, riskColor } from '../utils/risk';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

export default function Dashboard() {
  const { data, loading, error, refetch } = useApiData('/dashboard');

  const radarData = useMemo(() => {
    if (!data) return [];
    const c = data.overallRisk.components;
    return [
      { component: 'Geopolitical', score: c.geopolitical },
      { component: 'Shipping', score: c.shipping },
      { component: 'Supplier', score: c.supplier },
      { component: 'Price Volatility', score: c.priceVolatility },
      { component: 'Reserve', score: c.reserve },
    ];
  }, [data]);

  return (
    <div>
      <PageHeader
        title="Energy Resilience Command Center"
        subtitle="Real-time (demo) view of India's crude oil supply chain risk posture across geopolitics, shipping corridors, suppliers, and strategic reserves."
      />

      {loading && <LoadingState label="Computing risk posture…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <>
          {/* Top row: overall risk ring + corridor rings + key stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 18, marginBottom: 18 }}>
            <Panel eyebrow="Composite Score" title="Overall Energy Supply Risk" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <RiskRing score={data.overallRisk.score} level={data.overallRisk.level} size={150} />
            </Panel>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
              <StatCard
                label="Crude Oil Price"
                value={`$${formatNumber(data.crudeOilPriceUsdPerBarrel, 1)}`}
                unit="/ bbl"
                sublabel={data.isDemoData ? 'Demo baseline price' : 'Live EIA Brent price'}
              />
              <StatCard
                label="Supply at Risk"
                value={formatNumber(data.estimatedSupplyAtRiskKbpd)}
                unit="kbpd"
                accent="var(--accent-oil)"
                sublabel="Estimated exposure"
              />
              <StatCard
                label="Reserve Coverage"
                value={data.strategicReserve ? formatNumber(data.strategicReserve.coverageDays, 1) : '—'}
                unit="days"
                sublabel={data.strategicReserve ? data.strategicReserve.status : ''}
              />
              <StatCard
                label="Active Alerts"
                value={data.activeAlerts.length}
                accent={data.activeAlerts.length > 0 ? 'var(--risk-high)' : 'var(--risk-low)'}
                sublabel="Requiring attention"
              />
              {data.hormuzCorridorRisk && (
                <div style={{ gridColumn: 'span 1' }}>
                  <MiniCorridorCard name="Strait of Hormuz" corridor={data.hormuzCorridorRisk} />
                </div>
              )}
              {data.redSeaCorridorRisk && (
                <div style={{ gridColumn: 'span 1' }}>
                  <MiniCorridorCard name="Red Sea Corridor" corridor={data.redSeaCorridorRisk} />
                </div>
              )}
            </div>
          </div>

          {/* Second row: risk breakdown radar + alerts + events */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            <Panel eyebrow="Risk Engine Breakdown" title="Weighted Risk Components">
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="var(--border-subtle)" />
                    <PolarAngleAxis dataKey="component" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                    <Radar name="Risk" dataKey="score" stroke="var(--accent-oil)" fill="var(--accent-oil)" fillOpacity={0.28} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 12 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Overall = 30% Geopolitical + 25% Shipping + 20% Supplier + 15% Price Volatility + 10% Reserve
              </p>
            </Panel>

            <Panel eyebrow="Active Alerts" title={`${data.activeAlerts.length} alert(s)`}>
              {data.activeAlerts.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No active alerts. All monitored thresholds are within range.</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }}>
                {data.activeAlerts.map((a) => (
                  <div key={a._id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</span>
                      <Badge kind="severity" value={a.severity}>{a.severity}</Badge>
                    </div>
                    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>{a.message}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Third row: recent events */}
          <Panel eyebrow="Intelligence Feed" title="Recent Geopolitical Events">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.recentEvents.map((ev) => (
                <div key={ev._id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 14, alignItems: 'start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    {new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>{ev.region}</div>
                  </div>
                  <Badge kind="severity" value={ev.severity}>{ev.severity}</Badge>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

function MiniCorridorCard({ name, corridor }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {name}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: riskColor(corridor.level) }}>
        {corridor.score}
      </span>
      <Badge kind="risk" value={corridor.level}>{corridor.level} · {corridor.status}</Badge>
    </div>
  );
}
