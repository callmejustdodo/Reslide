import type { ReactNode } from 'react';
import { cn } from '@/utils/cn.js';

interface ListProps {
  items: ReactNode[];
  ordered?: boolean;
  className?: string;
}

export function List({ items, ordered = false, className }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag
      className={cn(
        'text-[1.75rem] font-body text-rs-text leading-loose pl-8 m-0',
        ordered ? 'list-decimal' : 'list-disc',
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={i} className="mb-2">
          {item}
        </li>
      ))}
    </Tag>
  );
}
