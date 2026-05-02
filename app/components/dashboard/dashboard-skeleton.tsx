import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* 🔷 TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl border p-4 flex justify-between items-center"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        ))}
      </div>

      {/* 🔷 MIDDLE + RIGHT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 📊 TABLE SECTION */}
        <div className="lg:col-span-2 space-y-4 border rounded-xl p-4">
          <Skeleton className="h-5 w-64" />

          {/* table header */}
          <div className="grid grid-cols-6 gap-4 border-b pb-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          {/* table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          ))}
        </div>

        {/* 📦 RIGHT PANEL */}
        <div className="space-y-6">
          {/* Low Stock */}
          <div className="border rounded-xl p-4 space-y-3">
            <Skeleton className="h-5 w-40" />

            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>

          {/* Alerts */}
          <div className="border rounded-xl p-4 space-y-3">
            <Skeleton className="h-5 w-32" />

            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
