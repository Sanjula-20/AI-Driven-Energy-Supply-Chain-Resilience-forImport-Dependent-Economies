import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Command Center', icon: '◈' },
  { to: '/map', label: 'Supply Chain Map', icon: '◎' },
  { to: '/suppliers', label: 'Suppliers', icon: '▤' },
  { to: '/corridors', label: 'Corridors', icon: '⇄' },
  { to: '/events', label: 'Geopolitical Events', icon: '⚑' },
  { to: '/reserves', label: 'Strategic Reserve', icon: '▮' },
  { to: '/scenarios', label: 'What If? Simulator', icon: '✦' },
  { to: '/recommendations', label: 'Recommendations', icon: '➤' },
  { to: '/alerts', label: 'Alerts', icon: '⚠' },
];

export default function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 'var(--sidebar-width)',
          flexShrink: 0,
          background: 'var(--bg-panel)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--accent-oil)',
                boxShadow: '0 0 10px var(--accent-oil)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em' }}>
              EnergyShield
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.08em' }}>
            RISK INTELLIGENCE · V1
          </div>
        </div>

        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-panel-hover)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent-oil)' : '2px solid transparent',
                marginBottom: 2,
              })}
            >
              <span aria-hidden="true" style={{ width: 16, textAlign: 'center', color: 'var(--accent-signal)' }}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
            {user?.role}
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '8px 0',
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12.5,
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: '26px 32px 60px' }}>
        <Outlet />
      </main>
    </div>
  );
}
