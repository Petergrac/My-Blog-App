import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  BookOpenText,
  ChartColumnIncreasing,
  MessageSquareText,
  PenSquare,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import CategoryLinks from "@/components/blog/CagegoryLinks";
import NoPosts from "@/components/blog/NoPosts";
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
  getCategoryHref,
  getCategoryLabel,
  postCategories,
} from "@/lib/categories";
import { withPublicPostCache } from "@/lib/prisma-cache";
import { prismaAccelerate } from "@/lib/prisma";

export const revalidate = 60;

type LandingPost = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  createdAt: Date;
  author: {
    username: string | null;
    avatar: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function scorePost(post: LandingPost) {
  return post._count.likes * 2 + post._count.comments;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 p-4 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] sm:tracking-tight text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function StoryMeta({ post }: { post: LandingPost }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Image
          src={post.author.avatar || "/noAvatar.jpeg"}
          alt={post.author.username || "Author"}
          width={28}
          height={28}
          className="size-7 rounded-full border border-border object-cover"
        />
        <span>{post.author.username || "Anonymous"}</span>
      </div>
      <span>{formatDate(post.createdAt)}</span>
      <span>{post._count.likes} likes</span>
      <span>{post._count.comments} comments</span>
    </div>
  );
}

export default async function Home() {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  const canWrite = role === "Author" || role === "Admin";

  const [
    publishedPosts,
    totalPosts,
    totalAuthors,
    totalComments,
    totalLikes,
    categoryRows,
  ] = (await Promise.all([
    prismaAccelerate.post.findMany({
      ...withPublicPostCache(),
      where: { state: "PUBLISHED" },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        category: true,
        createdAt: true,
        author: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    }),
    prismaAccelerate.post.count({
      ...withPublicPostCache(),
      where: { state: "PUBLISHED" },
    }),
    prismaAccelerate.user.count({
      ...withPublicPostCache(),
      where: {
        posts: {
          some: {
            state: "PUBLISHED",
          },
        },
      },
    }),
    prismaAccelerate.comment.count(withPublicPostCache()),
    prismaAccelerate.like.count(withPublicPostCache()),
    prismaAccelerate.post.findMany({
      ...withPublicPostCache(),
      where: {
        state: "PUBLISHED",
      },
      select: {
        category: true,
      },
    }),
  ])) as unknown as [
    LandingPost[],
    number,
    number,
    number,
    number,
    Array<{ category: string }>
  ];

  if (publishedPosts.length === 0) {
    return (
      <div className="pb-16">
        <CategoryLinks />
        <NoPosts />
      </div>
    );
  }

  const rankedPosts = [...publishedPosts].sort(
    (left, right) => scorePost(right) - scorePost(left),
  );
  const heroPost = rankedPosts[0]!;
  const spotlightPosts = rankedPosts
    .filter((post) => post.id !== heroPost.id)
    .slice(0, 3);
  const spotlightIds = new Set(spotlightPosts.map((post) => post.id));
  const latestPosts = publishedPosts
    .filter((post) => post.id !== heroPost.id && !spotlightIds.has(post.id))
    .slice(0, 6);
  const categoryCountMap = categoryRows.reduce<Map<string, number>>(
    (map, row) => {
      map.set(row.category, (map.get(row.category) ?? 0) + 1);
      return map;
    },
    new Map(),
  );

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_38%),radial-gradient(circle_at_75%_20%,rgba(250,204,21,0.14),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.04),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="space-y-7">
            <Badge
              className="rounded-full bg-sky-500/12 px-4 py-1.5 text-sky-600 dark:text-sky-300"
              variant="secondary"
            >
              Modern publishing workflow
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                A cleaner blog studio for writing, publishing, and growing an
                audience.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Bloog is an open source blog app.Discover fresh engineering
                stories, publish with a richer editor, and manage your writing
                flow with a calmer workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-sky-500 text-black hover:bg-sky-400"
                size="lg"
              >
                <Link href={canWrite ? "/new" : "/sign-up"}>
                  {canWrite ? "Start writing" : "Create an account"}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/blog/${heroPost.id}`}>
                  Read editor&apos;s pick
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Published posts" value={totalPosts.toString()} />
              <StatCard
                label="Active authors"
                value={totalAuthors.toString()}
              />
              <StatCard
                label="Conversations"
                value={totalComments.toString()}
              />
              <StatCard label="Reader likes" value={totalLikes.toString()} />
            </div>
          </div>

          <Link
            href={`/blog/${heroPost.id}`}
            className="group relative overflow-hidden rounded-4xl border border-border/70 bg-card shadow-2xl"
          >
            <div className="relative aspect-4/5 overflow-hidden">
              <Image
                src={heroPost.coverImage}
                alt={heroPost.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <Badge className="mb-4 bg-white/12 text-white" variant="outline">
                Editor&apos;s pick
              </Badge>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                  {heroPost.title}
                </h2>
                <p className="line-clamp-3 text-sm text-white/80 sm:text-base">
                  {heroPost.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span>{getCategoryLabel(heroPost.category)}</span>
                  <span>{formatDate(heroPost.createdAt)}</span>
                  <span>{heroPost._count.likes} likes</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <CategoryLinks />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-6 flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Topics
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Explore the catalogue
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            The landing page surfaces the core editorial lanes clearly, so
            readers can move from browsing to deep reading without friction.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {postCategories.map((category) => (
            <Card
              key={category.value}
              className="border-border/70 bg-card/70 shadow-sm backdrop-blur"
            >
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{category.label}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {categoryCountMap.get(category.value) ?? 0} posts
                  </span>
                </div>
                <CardTitle className="text-xl">{category.label}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full justify-between"
                  variant="ghost"
                >
                  <Link href={getCategoryHref(category.value)}>
                    Explore topic
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Spotlight
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Stories with momentum
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden border-border/70 bg-card/80 shadow-lg">
            <Link
              href={`/blog/${heroPost.id}`}
              className="grid h-full md:grid-cols-2"
            >
              <div className="relative min-h-72">
                <Image
                  src={heroPost.coverImage}
                  alt={heroPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <Badge variant="secondary">
                    {getCategoryLabel(heroPost.category)}
                  </Badge>
                  <h3 className="text-2xl font-semibold leading-tight">
                    {heroPost.title}
                  </h3>
                  <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                    {heroPost.description}
                  </p>
                </div>
                <div className="space-y-4">
                  <StoryMeta post={heroPost} />
                  <div className="inline-flex w-fit items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition hover:bg-accent hover:text-accent-foreground">
                    Read story
                    <ArrowRight />
                  </div>
                </div>
              </div>
            </Link>
          </Card>

          <div className="grid gap-4">
            {spotlightPosts.map((post) => (
              <Card
                key={post.id}
                className="border-border/70 bg-card/75 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="flex gap-4 p-5">
                  <div className="relative hidden aspect-square w-24 overflow-hidden rounded-2xl sm:block">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline">
                        {getCategoryLabel(post.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-lg font-semibold leading-tight hover:text-sky-500"
                    >
                      {post.title}
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {post.description}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{post._count.likes} likes</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Latest stories
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Fresh posts from the feed
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href={`/blog/${heroPost.id}`}>Jump into reading</Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(latestPosts.length ? latestPosts : publishedPosts.slice(0, 6)).map(
            (post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group">
                <Card className="h-full overflow-hidden border-border/70 bg-card/80 shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline">
                        {getCategoryLabel(post.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold leading-tight">
                        {post.title}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {post.description}
                      </p>
                    </div>
                    <StoryMeta post={post} />
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(250,204,21,0.08),transparent)] shadow-lg">
          <CardHeader className="gap-3">
            <Badge variant="outline" className="p-1 pl-5">
              Platform refresh
            </Badge>
            <CardTitle className="text-3xl">
              Built to feel more production-ready
            </CardTitle>
            <CardDescription className="max-w-3xl leading-6">
              The app presents a clearer reading funnel and a more deliberate
              authoring surface. The next update will be to expand the product
              model.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/85 p-5">
              <Sparkles className="mb-4 text-sky-500" />
              <h3 className="text-lg font-semibold">
                Intentional landing page
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Readers can now discover topics, spotlight posts, and fresh
                content without scrolling through unstructured strips.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/85 p-5">
              <PenSquare className="mb-4 text-sky-500" />
              <h3 className="text-lg font-semibold">
                Cleaner writing workflow
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Metadata, cover image, publish state, and editor canvas are
                being reorganized into a calmer author workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/85 p-5">
              <ChartColumnIncreasing className="mb-4 text-sky-500" />
              <h3 className="text-lg font-semibold">
                Better query foundations
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Indexes that favor the actual read paths: published feeds,
                category browsing, author dashboards, comments, and likes.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <BookOpenText className="text-sky-500" />
              <CardTitle>Reader-first discovery</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              Editorial picks, topic navigation, and social proof carry the
              first screen instead of thin horizontal carousels.
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <MessageSquareText className="text-sky-500" />
              <CardTitle>Stronger engagement signals</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              Likes and comment volume are surfaced more deliberately to make
              the ecosystem feel active and trustworthy.
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <PenSquare className="text-sky-500" />
              <CardTitle>Ready for more product depth</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              The interface is now in a better place to support future models
              like tags, bookmarks, or editorial workflows without collapsing
              visually.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
