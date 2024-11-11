import { useId } from 'react';

interface PlaceholderImageProps {
  width: number;
  height: number;
  text?: string;
}

export function PlaceholderImage({ width, height, text }: PlaceholderImageProps) {
  const id = useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#E5E7EB" />
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#D1D5DB" stopOpacity="1" />
          <stop offset="100%" stopColor="#9CA3AF" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gradient-${id})`} />
      {text && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#4B5563"
          fontSize={Math.min(width, height) / 10}
          fontFamily="system-ui, sans-serif"
        >
          {text}
        </text>
      )}
    </svg>
  );
}