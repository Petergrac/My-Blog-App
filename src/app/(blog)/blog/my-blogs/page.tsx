import AuthorHeader from "@/components/AuthorHeader";
import BlogAuthor from "@/components/BlogAuthor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const AuthorBlogs = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/unauthorized");
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      state: true,
      coverImage: true,
      category: true,
      createdAt: true,
      accessKey: true,
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
    where: {
      author: {
        clerkId: userId,
      },
    },
  });

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <Card className="overflow-hidden border-border/70 bg-card/95 shadow-lg">
          <CardContent className="grid gap-8 p-8 md:p-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="space-y-4">
              <Badge className="w-fit" variant="outline">
                Author workspace
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Your publishing queue is empty.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                Start a new post and it will appear here with draft and
                published states separated into a cleaner workflow.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/new">Create a post</Link>
                </Button>
                <Button asChild type="button" variant="outline">
                  <Link href="/user-profile">Manage account</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-muted/20 p-5 text-sm leading-7 text-muted-foreground">
              You still need author privileges to publish publicly. If your role
              is wrong, update it from the account screen and come back here.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const author = posts[0].author!;
  const counts = posts.map((post) => post._count);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-6">
      <AuthorHeader author={author} postCount={counts} />
      <BlogAuthor posts={posts} />
    </div>
  );
};

export default AuthorBlogs;
