import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { role: 'ADMIN', email: 'admin@energyshield.ai' },
  { role: 'ANALYST', email: 'analyst@energyshield.ai' },
  { role: 'VIEWER', email: 'viewer@energyshield.ai' },
];

export default function Login() {
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background:
          'radial-gradient(circle at 20% 20%, rgba(232,163,61,0.08), transparent 45%), radial-gradient(circle at 80% 80%, rgba(63,199,192,0.08), transparent 45%), var(--bg-void)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--accent-oil)',
                boxShadow: '0 0 14px var(--accent-oil)',
              }}
            />
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700 }}>
              EnergyShield <span style={{ color: 'var(--accent-oil)' }}>AI</span>
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13.5 }}>
            AI-Powered Energy Supply Chain Resilience &amp; Risk Intelligence
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '26px 26px 22px',
            boxShadow: 'var(--shadow-panel)',
          }}
        >
          <label style={fieldLabel}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@energyshield.ai"
            style={inputStyle}
          />

          <label style={{ ...fieldLabel, marginTop: 14 }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />

          {(localError || error) && (
            <div style={{ marginTop: 12, fontSize: 12.5, color: '#ff9b9e' }}>{localError || error}</div>
          )}

          <button type="submit" disabled={loading} style={submitStyle}>
            {loading ? 'Signing in…' : 'Enter Command Center'}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            padding: '14px 16px',
            border: '1px dashed var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            DEMO ACCOUNTS (see backend .env for passwords)
          </div>
          {DEMO_ACCOUNTS.map((acc) => (
            <div key={acc.email} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
              <span className="mono">{acc.email}</span>
              <span>{acc.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const fieldLabel = {
  display: 'block',
  fontSize: 12,
  color: 'var(--text-secondary)',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--bg-panel-raised)',
  border: '1px solid var(--border-strong)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  fontSize: 13.5,
  outline: 'none',
};

const submitStyle = {
  width: '100%',
  marginTop: 20,
  padding: '11px 0',
  background: 'var(--accent-oil)',
  border: 'none',
  borderRadius: 8,
  color: '#1a1305',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
};
