import Comments from "@/components/blog/Comments";
import LikePost from "@/components/blog/LikePost";
import MostRecent from "@/components/blog/MostRecent";
import StaticRenderer from "@/components/blog/StaticRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryHref, getCategoryLabel } from "@/lib/categories";
import { getCurrentDatabaseUser } from "@/lib/current-user";
import { directPrisma } from "@/lib/prisma";
import { getPost } from "@/lib/postQueries";
import {
  CalendarDays,
  MessageCircle,
  MoveRight,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

type RelatedPost = {
  id: string;
  title: string;
  createdAt: Date;
  category: string;
  coverImage: string;
  description: string;
  _count: {
    comments: number;
    likes: number;
  };
  author: {
    username: string | null;
    avatar: string | null;
    bio: string | null;
  };
};

export async function generateStaticParams() {
  const posts = await directPrisma.post.findMany({
    select: {
      id: true,
    },
  });

  return posts.map((post: { id: string }) => ({
    id: post.id,
  }));
}

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post = await getPost(id);

  if (!post || !post.content) {
    notFound();
  }

  const currentUser = await getCurrentDatabaseUser();
  const currentId = currentUser?.id ?? null;

  const hasLiked = post.likes.some(
    (like) => like.userId === currentId && like.postId === id,
  );
  const postComments = post.comments;
  const postContent = JSON.parse(post.content) as JSONContent;
  const relatedPosts = (await directPrisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      category: true,
      coverImage: true,
      description: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      author: {
        select: {
          username: true,
          avatar: true,
          bio: true,
        },
      },
    },
    take: 3,
    where: {
      category: post.category,
      id: {
        not: post.id,
      },
      state: "PUBLISHED",
    },
  })) as unknown as RelatedPost[];

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-6 lg:py-10">
      <Card className="overflow-hidden border-border/70 bg-card/95 shadow-lg">
        <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="order-2 space-y-6 p-6 md:p-8 lg:order-1 lg:p-10">
            <Badge className="w-fit" variant="outline">
              Article
            </Badge>

            <div className="space-y-4">
              <Link href={getCategoryHref(post.category)}>
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                  {getCategoryLabel(post.category)}
                </p>
              </Link>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                {post.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="rounded-full border border-border/70 bg-muted/20 px-4 py-2">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-sky-500" />
                  {post.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="rounded-full border border-border/70 bg-muted/20 px-4 py-2">
                <span className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-emerald-500" />
                  {postComments.length} comment
                  {postComments.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="rounded-full border border-border/70 bg-muted/20 px-4 py-2">
                <span className="flex items-center gap-2">
                  <ThumbsUp className="size-4 text-amber-500" />
                  {post.likes.length} like{post.likes.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-muted/20 p-4 md:p-5">
              <div className="flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-full border border-border/70">
                  <Image
                    alt={post.author.username || "Author avatar"}
                    className="object-cover"
                    fill
                    src={post.author.avatar || "/noAvatar.jpeg"}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">
                    {post.author.username || "Unknown author"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {post.author.country || "Global contributor"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 min-h-88 lg:order-2 lg:min-h-full">
            <Image
              alt={post.title}
              className="object-cover"
              fill
              src={post.coverImage}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card className="border-border/70 bg-card/95 shadow-sm lg:sticky lg:top-24">
          <CardHeader className="border-b border-border/60 bg-muted/20">
            <Badge className="w-fit" variant="outline">
              Reading details
            </Badge>
            <CardTitle className="text-2xl">Article snapshot</CardTitle>
            <CardDescription>
              Quick context before you keep reading.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <UserRound className="mt-0.5 size-4 shrink-0 text-sky-500" />
              <div>
                <p className="font-medium text-foreground">
                  {post.author.username || "Anonymous author"}
                </p>
                <p className="mt-1 leading-6 text-muted-foreground">
                  {post.author.bio || "No bio provided yet."}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Category
                </p>
                <p className="mt-2 font-medium">
                  {getCategoryLabel(post.category)}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Engagement
                </p>
                <p className="mt-2 font-medium">
                  {post.likes.length} likes and {postComments.length} comments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols w-full">
        <div className="space-y-6">
          <StaticRenderer content={postContent} />

          <LikePost
            data={{ currentId, id }}
            hasLiked={hasLiked}
            likes={post.likes.length}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <Card className="border-border/70 bg-card/95 shadow-sm">
              <CardHeader className="border-b border-border/60 bg-muted/20">
                <Badge className="w-fit" variant="outline">
                  About the author
                </Badge>
                <CardTitle className="text-2xl">
                  {post.author.username || "Anonymous author"}
                </CardTitle>
                <CardDescription>
                  Writer profile and context for this story.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="relative size-14 overflow-hidden rounded-full border border-border/70">
                    <Image
                      alt={post.author.username || "Author avatar"}
                      className="object-cover"
                      fill
                      src={post.author.avatar || "/noAvatar.jpeg"}
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      {post.author.username || "Anonymous author"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {post.author.country || "Global contributor"}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {post.author.bio || "No bio provided yet."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/95 shadow-sm">
              <CardHeader className="border-b border-border/60 bg-muted/20">
                <Badge className="w-fit" variant="outline">
                  Continue exploring
                </Badge>
                <CardTitle className="text-2xl">Browse this topic</CardTitle>
                <CardDescription>
                  Jump back into the category archive or find more related work.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                  This article now sits inside a more structured reading flow,
                  so topic browsing and story discovery feel connected.
                </div>
                <Button asChild className="w-full">
                  <Link href={getCategoryHref(post.category)}>
                    Explore {getCategoryLabel(post.category)}
                    <MoveRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Comments comments={postComments} postId={id} userId={currentId} />
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Related stories
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                More from {getCategoryLabel(post.category)}
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href={getCategoryHref(post.category)}>
                View category archive
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <MostRecent key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PostPage;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.description,
  };
}
