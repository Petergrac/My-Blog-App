import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCategoryHref, postCategories } from "@/lib/categories";

const CagegoryLinks = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 border-b border-border/70 px-4 py-5">
      {postCategories.map((category) => (
        <Button
          key={category.value}
          asChild
          className="rounded-full border-border/70 bg-background/70 text-xs font-medium text-foreground shadow-none backdrop-blur hover:bg-accent"
          variant="outline"
        >
          <Link href={getCategoryHref(category.value)}>{category.label}</Link>
        </Button>
      ))}
    </div>
  );
};

export default CagegoryLinks;
