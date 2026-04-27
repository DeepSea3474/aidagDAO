'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#020617', color: '#fff', fontFamily: 'system-ui, sans-serif', margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 24, maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button onClick={() => reset()} style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
