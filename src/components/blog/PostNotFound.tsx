import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PostNotFound = () => {
  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardContent className="flex min-h-[22rem] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Nothing here yet
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            We could not find articles for this view.
          </h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            The posts may have been removed, moved back to draft, or never
            published in this category.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to homepage</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostNotFound;
