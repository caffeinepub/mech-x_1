import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'list';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ variant = 'card', count = 1, className }: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div className={cn('space-y-3', className)}>
        {items.map((i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 space-y-3 animate-pulse"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {items.map((i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        {items.map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card animate-pulse"
          >
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
