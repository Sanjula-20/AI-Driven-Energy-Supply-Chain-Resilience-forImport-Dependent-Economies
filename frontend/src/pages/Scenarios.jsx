import { useState } from 'react';
import useApiData from '../utils/useApiData';
import client from '../api/client';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import StatCard from '../components/StatCard';
import { LoadingState, ErrorState } from '../components/States';
import { formatNumber } from '../utils/risk';

export default function Scenarios() {
  const { data: catalog, loading: catalogLoading, error: catalogError } = useApiData('/scenarios');

  const [scenarioKey, setScenarioKey] = useState('');
  const [duration, setDuration] = useState(7);
  const [severity, setSeverity] = useState(3);
  const [result, setResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState(null);

  const activeKey = scenarioKey || catalog?.scenarios?.[0]?.key || '';

  async function runSimulation(e) {
    e.preventDefault();
    setSimLoading(true);
    setSimError(null);
    setResult(null);
    try {
      const { data } = await client.post('/scenarios/simulate', {
        scenarioKey: activeKey,
        durationDays: Number(duration),
        severity: Number(severity),
      });
      setResult(data);
    } catch (err) {
      setSimError(err.response?.data?.message || 'Simulation failed.');
    } finally {
      setSimLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title='"What If?" Scenario Simulator'
        subtitle="Run transparent, rule-based disruption scenarios to estimate supply loss, price impact, and reserve requirements. For V1, calculations are demo-grade and fully explainable."
      />

      {catalogLoading && <LoadingState label="Loading scenario catalog…" />}
      {catalogError && <ErrorState message={catalogError} />}

      {catalog && (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 18 }}>
          <Panel eyebrow="Configure" title="Scenario Parameters">
            <form onSubmit={runSimulation} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Scenario type</label>
                <select value={activeKey} onChange={(e) => setScenarioKey(e.target.value)} style={inputStyle}>
                  {catalog.scenarios.map((s) => (
                    <option key={s.key} value={s.key}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Duration: {duration} day(s)</label>
                <input
                  type="range"
                  min={1}
                  max={90}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Severity: {severity} / 5</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                {catalog.scenarios.find((s) => s.key === activeKey)?.description}
              </p>

              <button type="submit" disabled={simLoading} style={submitStyle}>
                {simLoading ? 'Simulating…' : 'Run Simulation'}
              </button>
              {simError && <ErrorState message={simError} />}
            </form>
          </Panel>

          <Panel eyebrow="Projected Impact" title={result ? result.scenario.name : 'Run a simulation to see results'}>
            {!result && !simLoading && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
                Choose a scenario, duration, and severity, then run the simulation to see estimated impact.
              </p>
            )}
            {simLoading && <LoadingState label="Running simulation…" />}
            {result && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 18 }}>
                  <StatCard
                    label="Supply loss"
                    value={`${formatNumber(result.results.estimatedSupplyLossPercent, 1)}%`}
                    accent="var(--risk-high)"
                    sublabel={`${formatNumber(result.results.estimatedSupplyLossKbpd)} kbpd`}
                  />
                  <StatCard
                    label="Price impact"
                    value={`+${formatNumber(result.results.estimatedPriceImpactPercent, 1)}%`}
                    accent="var(--accent-oil)"
                  />
                  <StatCard
                    label="Reserve requirement"
                    value={formatNumber(result.results.reserveRequirementMbbl, 1)}
                    unit="M bbl"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
                  <DetailRow label="Affected suppliers" value={result.results.affectedSuppliers?.join(', ') || 'None specified'} />
                  <DetailRow label="Affected corridors" value={result.results.affectedCorridors?.join(', ') || 'None specified'} />
                  <div
                    style={{
                      marginTop: 4,
                      padding: '12px 14px',
                      background: 'rgba(232, 163, 61, 0.08)',
                      border: '1px solid rgba(232, 163, 61, 0.3)',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-oil)' }}>
                      Recommended action
                    </span>
                    <p style={{ margin: '4px 0 0', fontSize: 13.5 }}>{result.results.recommendedAction}</p>
                  </div>
                  <span className="demo-flag" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                    Rule-based demo calculation
                  </span>
                </div>
              </>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ textAlign: 'right' }}>{value}</span>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 };
const inputStyle = {
  width: '100%',
  padding: '9px 10px',
  background: 'var(--bg-panel-raised)',
  border: '1px solid var(--border-strong)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  fontSize: 13.5,
};
const submitStyle = {
  padding: '11px 0',
  background: 'var(--accent-oil)',
  border: 'none',
  borderRadius: 8,
  color: '#1a1305',
  fontWeight: 700,
  fontSize: 13.5,
  cursor: 'pointer',
};
