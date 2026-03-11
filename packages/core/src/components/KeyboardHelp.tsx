import { useEffect, useState } from 'react';

const shortcuts = [
  { key: '→ / Space', action: 'Next step or slide' },
  { key: '←', action: 'Previous step or slide' },
  { key: 'Home', action: 'First slide' },
  { key: 'End', action: 'Last slide' },
  { key: 'P', action: 'Presenter mode' },
  { key: 'O', action: 'Slide overview' },
  { key: '?', action: 'Toggle this help' },
];

export function KeyboardHelp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setVisible((v) => !v);
      }
      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setVisible(false)}
    >
      <div
        style={{
          background: 'var(--rs-color-surface, #1e293b)',
          color: 'var(--rs-color-text, #fff)',
          borderRadius: '12px',
          padding: '2rem',
          minWidth: '320px',
          fontFamily: 'var(--rs-font-body)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontFamily: 'var(--rs-font-heading)' }}>
          Keyboard Shortcuts
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {shortcuts.map(({ key, action }) => (
              <tr key={key}>
                <td style={{ padding: '0.4rem 1rem 0.4rem 0', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  <kbd style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                  }}>
                    {key}
                  </kbd>
                </td>
                <td style={{ padding: '0.4rem 0', opacity: 0.8 }}>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
