import { useEffect, useState, useRef } from 'react';
import { cn } from '@/utils/cn.js';

interface CodeProps {
  children: string;
  language?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

export function Code({
  children,
  language = 'typescript',
  highlightLines = [],
  showLineNumbers = false,
  className,
}: CodeProps) {
  const [html, setHtml] = useState<string>('');
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        const shiki = await import('shiki');
        const highlighter = await shiki.createHighlighter({
          themes: ['github-dark'],
          langs: [language],
        });

        const result = highlighter.codeToHtml(children.trim(), {
          lang: language,
          theme: 'github-dark',
        });

        if (!cancelled) setHtml(result);
        highlighter.dispose();
      } catch {
        // Fallback: plain text
        if (!cancelled) {
          setHtml(`<pre><code>${escapeHtml(children.trim())}</code></pre>`);
        }
      }
    }

    highlight();
    return () => { cancelled = true; };
  }, [children, language]);

  return (
    <div
      ref={codeRef}
      className={cn(
        'rounded-xl overflow-hidden text-xl font-code leading-relaxed text-left',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
