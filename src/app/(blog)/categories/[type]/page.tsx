import CagegoryLinks from "@/components/blog/CagegoryLinks";
import MostRecent from "@/components/blog/MostRecent";
import PostNotFound from "@/components/blog/PostNotFound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { getCategoryLabel, postCategories } from "@/lib/categories";
import prisma from "@/lib/prisma";
import { ArrowRight, BookOpenText, Layers3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await prisma.post.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
    where: {
      state: "PUBLISHED",
    },
  });

  return categories.map((cat) => ({
    type: cat.category,
  }));
}

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const { type } = await params;
  const categoryType = decodeURIComponent(type);

  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      title: true,
      id: true,
      createdAt: true,
      coverImage: true,
      description: true,
      category: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          avatar: true,
        },
      },
    },
    where: {
      category: categoryType,
      state: "PUBLISHED",
    },
  });

  const currentCategory = postCategories.find(
    (category) => category.value === categoryType
  );
  const leadPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="space-y-8">
        <Card className="overflow-hidden border-border/70 bg-card/95 shadow-lg">
          <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5 p-6 md:p-8">
              <Badge className="w-fit" variant="outline">
                Category archive
              </Badge>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {getCategoryLabel(categoryType)}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                  {currentCategory?.description ||
                    "Explore the latest writing collected under this topic."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Published posts
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{posts.length}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Discovery
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    Fresh cards, cleaner structure, faster browsing
                  </p>
                </div>
              </div>
            </div>
            <div className="relative min-h-[18rem]">
              <Image
                alt={getCategoryLabel(categoryType)}
                className="object-cover"
                fill
                src="/hero/categories.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-foreground">
                <p className="text-sm uppercase tracking-[0.26em] text-muted-foreground">
                  Curated topic
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6">
                  Move between categories without losing the polished card layout
                  or reading context.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <CagegoryLinks />

        {posts.length === 0 ? (
          <PostNotFound />
        ) : (
          <>
            {leadPost && (
              <Card className="overflow-hidden border-border/70 bg-card/95 shadow-sm">
                <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_420px]">
                  <div className="order-2 space-y-5 p-6 md:p-8 lg:order-1">
                    <Badge className="w-fit" variant="secondary">
                      Editor&apos;s pick
                    </Badge>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-semibold tracking-tight">
                        {leadPost.title}
                      </h2>
                      <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                        {leadPost.description}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          <BookOpenText className="size-4 text-sky-500" />
                          Stronger article layout
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Better reading rhythm, cleaner metadata, and more
                          structured detail pages.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          <Layers3 className="size-4 text-sky-500" />
                          Related discovery
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Keep readers moving through the topic with cards that
                          feel consistent across the app.
                        </p>
                      </div>
                    </div>
                    <Button asChild className="w-fit">
                      <Link href={`/blog/${leadPost.id}`}>
                        Read featured story
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                  <Link
                    className="relative order-1 min-h-[20rem] lg:order-2"
                    href={`/blog/${leadPost.id}`}
                  >
                    <Image
                      alt={leadPost.title}
                      className="object-cover"
                      fill
                      src={leadPost.coverImage}
                    />
                  </Link>
                </CardContent>
              </Card>
            )}

            {remainingPosts.length > 0 && (
              <section className="space-y-4">
                <div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                      More in {getCategoryLabel(categoryType)}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Continue exploring this topic
                    </h2>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <MostRecent key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
