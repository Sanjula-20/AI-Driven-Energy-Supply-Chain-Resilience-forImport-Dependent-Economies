export function LoadingState({ label = 'Loading data…' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '40px 0',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          border: '2px solid var(--border-strong)',
          borderTopColor: 'var(--accent-oil)',
          borderRadius: '50%',
          animation: 'es-spin 0.8s linear infinite',
        }}
      />
      {label}
      <style>{`@keyframes es-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div
      style={{
        padding: '18px 20px',
        background: 'rgba(229, 72, 77, 0.08)',
        border: '1px solid rgba(229, 72, 77, 0.35)',
        borderRadius: 'var(--radius-md)',
        color: '#ff9b9e',
        fontSize: 13.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'transparent',
            border: '1px solid rgba(229, 72, 77, 0.5)',
            color: '#ff9b9e',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
