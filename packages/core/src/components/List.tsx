import type { ReactNode } from 'react';

interface ListProps {
  items: ReactNode[];
  ordered?: boolean;
  className?: string;
}

export function List({ items, ordered = false, className = '' }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag
      className={className}
      style={{
        fontSize: '1.75rem',
        fontFamily: 'var(--rs-font-body)',
        color: 'var(--rs-color-text)',
        lineHeight: 1.8,
        paddingLeft: '2rem',
        margin: 0,
        listStyleType: ordered ? 'decimal' : 'disc',
      }}
    >
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '0.5rem' }}>
          {item}
        </li>
      ))}
    </Tag>
  );
}
