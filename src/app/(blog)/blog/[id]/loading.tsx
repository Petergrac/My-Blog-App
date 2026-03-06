// app/blog/[id]/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 lg:py-10">
      <div className="grid gap-0 overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 shadow-lg lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5 p-8">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <div className="flex flex-wrap gap-3 pt-4">
            <Skeleton className="h-10 w-40 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
        <Skeleton className="min-h-[22rem] rounded-none" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Skeleton className="h-11 w-44 xl:hidden" />
          <div className="space-y-4 rounded-[2rem] border border-border/70 bg-card/95 p-8 shadow-sm">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className={index % 3 === 0 ? "h-7 w-2/3" : "h-4 w-full"}
              />
            ))}
          </div>
          <Skeleton className="h-28 w-full rounded-[2rem]" />
          <Skeleton className="h-64 w-full rounded-[2rem]" />
        </div>
        <Skeleton className="hidden h-80 w-full rounded-[2rem] lg:block" />
      </div>
    </div>
  );
}
