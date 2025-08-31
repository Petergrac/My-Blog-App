// app/blog/[id]/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">

      {/* Title */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-3/4" />
      </div>

      {/* Category & Date */}
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Content */}
      <div className="space-y-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* Author Avatar */}
      <div className="flex justify-center mt-10">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      {/* Author Name */}
      <div className="flex justify-center">
        <Skeleton className="h-4 w-32 mt-2" />
      </div>

      {/* Author Bio */}
      <div className="flex justify-center flex-col items-center space-y-2 mt-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>

    </div>
  );
}
