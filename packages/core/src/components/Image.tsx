import { cn } from '@/utils/cn.js';

interface ImageProps {
  src: string;
  alt?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const fitClasses: Record<string, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
};

export function Image({
  src,
  alt = '',
  fit = 'contain',
  width,
  height,
  className,
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('block max-w-full max-h-full', fitClasses[fit], className)}
      style={{
        width: width ?? '100%',
        height: height ?? 'auto',
      }}
    />
  );
}
