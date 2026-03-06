"use client";

import Link from "next/link";
import { useState } from "react";

import MostRecent from "./MostRecent";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export type PostType = {
  title: string;
  id: string;
  createdAt: Date;
  category: string;
  coverImage: string;
  description: string;
  state?: "PUBLISHED" | "DRAFT";
  accessKey?: string;
  author: {
    username: string | null;
    bio: string | null;
    avatar: string | null;
  };
  _count?: {
    comments: number;
    likes: number;
  };
};

const BlogAuthor = ({ posts }: { posts: PostType[] }) => {
  const [postState, setState] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const filteredPosts = posts.filter((post) => post.state === postState);
  const publishedCount = posts.filter((post) => post.state === "PUBLISHED").length;
  const draftCount = posts.filter((post) => post.state === "DRAFT").length;

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <Badge className="w-fit" variant="outline">
                Workspace
              </Badge>
              <CardTitle className="text-2xl">Your stories</CardTitle>
              <CardDescription>
                Switch between published work and drafts waiting for revision.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setState("PUBLISHED")}
                type="button"
                variant={postState === "PUBLISHED" ? "default" : "outline"}
              >
                Published
                <Badge variant="secondary">{publishedCount}</Badge>
              </Button>
              <Button
                onClick={() => setState("DRAFT")}
                type="button"
                variant={postState === "DRAFT" ? "default" : "outline"}
              >
                Drafts
                <Badge variant="secondary">{draftCount}</Badge>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm">
            <p className="font-medium text-foreground">
              {postState === "PUBLISHED" ? "Live posts" : "Draft queue"}
            </p>
            <p className="text-muted-foreground">
              {filteredPosts.length} item{filteredPosts.length === 1 ? "" : "s"}
            </p>
          </div>
        </CardContent>
      </Card>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <MostRecent isAuthor key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
            <p className="text-lg font-medium">No posts in this view yet.</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Switch the filter or start a new draft to keep your publishing
              pipeline moving.
            </p>
            <Button asChild>
              <Link href="/new">Create a new post</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogAuthor;
