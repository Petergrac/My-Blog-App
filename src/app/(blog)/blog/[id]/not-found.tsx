"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <h1 className="text-9xl font-bold tracking-tight text-muted-foreground">
            404
          </h1>
          <h1 className="mt-4 text-3xl font-semibold text-foreground">
            Article that you are looking for does not exist!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Maybe it was deleted or drafted.Go back to homepage and find a new
            post.
          </p>
          <div className="mt-6">
            <Button className="anim" onClick={() => router.push("/")}>
              Go Back Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
