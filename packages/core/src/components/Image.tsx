interface ImageProps {
  src: string;
  alt?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Image({
  src,
  alt = '',
  fit = 'contain',
  width,
  height,
  className = '',
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        objectFit: fit,
        width: width ?? '100%',
        height: height ?? 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'block',
      }}
    />
  );
}
