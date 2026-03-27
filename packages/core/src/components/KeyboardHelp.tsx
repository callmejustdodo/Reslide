import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn.js';

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-rs-surface text-rs-text rounded-xl p-8 min-w-80 shadow-lg border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 mb-4 text-xl font-heading font-semibold">
          Keyboard Shortcuts
        </h2>
        <table className="w-full border-collapse">
          <tbody>
            {shortcuts.map(({ key, action }) => (
              <tr key={key}>
                <td className="py-1.5 pr-4 font-bold whitespace-nowrap">
                  <kbd className="bg-white/10 px-2 py-0.5 rounded text-sm">
                    {key}
                  </kbd>
                </td>
                <td className="py-1.5 opacity-80">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
