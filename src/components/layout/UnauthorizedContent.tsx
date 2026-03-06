"use client";

import { useSearchParams } from "next/navigation";

const Unauthorized = () => {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        {errorMessage ? (
          <p className="font-semibold text-destructive text-base">
            {errorMessage}
          </p>
        ) : (
          <>
            <h2 className="text-lg font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground text-sm">
              It looks like you&apos;re trying to access data that doesn&apos;t
              belong to you. Please ensure you have the right permissions to
              read or modify this article.
            </p>
            <p className="text-muted-foreground text-sm">
              Use the navigation bar above to return to the homepage or browse
              other sections.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
