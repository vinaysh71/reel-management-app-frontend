import { Skeleton } from "@/components/ui/skeleton";

export function ReelsTableSkeleton() {
  return (
    <div className="w-full space-y-3">
      {/* toolbar skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32 ml-auto" />
      </div>

      {/* table header */}
      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 p-3 border-b">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>

        {/* rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 ml-auto rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
