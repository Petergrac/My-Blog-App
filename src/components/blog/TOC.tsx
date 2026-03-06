"use client";

import { cn } from "@/lib/utils";
import { ListTree } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TocItem {
  id: string;
  level: number;
  text: string;
}

interface ActiveTocProps {
  toc: TocItem[];
  variant?: "mobile" | "desktop";
}

const TocList = ({
  activeId,
  onNavigate,
  toc,
}: {
  activeId: string | null;
  onNavigate?: () => void;
  toc: TocItem[];
}) => (
  <div className="space-y-2">
    {toc.map((item) => (
      <a
        className={cn(
          "block rounded-xl px-3 py-2 text-sm leading-6 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          item.level === 2 && "ml-3",
          item.level >= 3 && "ml-6 text-xs",
          activeId === item.id &&
            "bg-sky-500/10 font-medium text-sky-700 dark:text-sky-300"
        )}
        href={`#${item.id}`}
        key={item.id}
        onClick={onNavigate}
      >
        {item.text}
      </a>
    ))}
  </div>
);

const ActiveToc = ({ toc, variant = "desktop" }: ActiveTocProps) => {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);
  const [open, setOpen] = useState(false);
  const headingSelector = useMemo(
    () =>
      toc.map((item) => `[data-article-body] [id="${item.id}"]`).join(", "),
    [toc]
  );

  useEffect(() => {
    if (!headingSelector) {
      return;
    }

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(headingSelector)
    );

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (entryA, entryB) =>
              entryB.intersectionRatio - entryA.intersectionRatio
          )[0];

        if (visibleHeading?.target.id) {
          setActiveId(visibleHeading.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0, 0.25, 0.6, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
      observer.disconnect();
    };
  }, [headingSelector]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <>
      {variant === "mobile" && (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button className="w-full justify-between" type="button" variant="outline">
              <span className="flex items-center gap-2">
                <ListTree className="size-4" />
                On this page
              </span>
              <Badge variant="secondary">{toc.length}</Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Table of contents</DialogTitle>
              <DialogDescription>
                Jump directly to the section you want.
              </DialogDescription>
            </DialogHeader>
            <TocList
              activeId={activeId}
              onNavigate={() => setOpen(false)}
              toc={toc}
            />
          </DialogContent>
        </Dialog>
      )}

      {variant === "desktop" && (
        <Card className="border-border/70 bg-card/95 shadow-sm xl:sticky xl:top-24">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <Badge className="w-fit" variant="outline">
            Navigator
          </Badge>
          <CardTitle className="text-lg">On this page</CardTitle>
          <CardDescription>
            Follow the article structure without losing your place.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto pt-6">
          <TocList activeId={activeId} toc={toc} />
        </CardContent>
        </Card>
      )}
    </>
  );
};

export default ActiveToc;
