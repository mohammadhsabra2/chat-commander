import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-7 w-16" />
          <Skeleton className="mt-1 h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="border-b border-border px-4 py-3.5">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      <Skeleton className="mb-4 h-5 w-32" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}
