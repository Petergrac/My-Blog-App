"use client";

import { deletePost, patchPost } from "@/actions/PostActions";
import { getCategoryHref, getCategoryLabel } from "@/lib/categories";
import { CalendarDays, MessageCircle, MoreVertical, Pencil, Rocket, ThumbsUp, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { FeaturedPostType } from "./FeaturedPost";
import { PostType } from "./BlogAuthor";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const MostRecent = ({
  post,
  isAuthor,
}: {
  post: FeaturedPostType & PostType;
  isAuthor?: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePostChange = async (type: "publish" | "delete") => {
    startTransition(async () => {
      if (type === "publish") {
        try {
          await patchPost({ state: "PUBLISHED" }, post.id);
          toast.success("Post successfully published.");
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Could not publish the post.");
        }
        return;
      }

      try {
        await deletePost(post.id);
        toast.success("Post successfully deleted.");
        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error("Post could not be deleted.");
      }
    });
  };

  return (
    <Card className="h-full overflow-hidden border-border/70 bg-card/95 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link className="relative block overflow-hidden" href={`/blog/${post.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            alt={post.title}
            className="object-cover transition-transform duration-500 hover:scale-105"
            fill
            src={post.coverImage}
          />
        </div>
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge className="bg-background/90 text-foreground hover:bg-background/90">
            {getCategoryLabel(post.category)}
          </Badge>
          {isAuthor && post.state && (
            <Badge variant={post.state === "PUBLISHED" ? "secondary" : "outline"}>
              {post.state === "PUBLISHED" ? "Live" : "Draft"}
            </Badge>
          )}
        </div>
      </Link>

      <CardHeader className="space-y-4 pb-0">
        <div className="flex items-center justify-between gap-3">
          <Link href={getCategoryHref(post.category)}>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {getCategoryLabel(post.category)}
            </p>
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <span>
              {post.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <Link href={`/blog/${post.id}`}>
            <h3 className="text-xl font-semibold leading-tight tracking-tight">
              {post.title}
            </h3>
          </Link>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {post.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-3">
          <div className="relative size-10 overflow-hidden rounded-full border border-border/70">
            <Image
              alt={post.author.username || "Author avatar"}
              className="object-cover"
              fill
              src={post.author.avatar || "/noAvatar.jpeg"}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {post.author.username || "Anonymous author"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {post.author.bio || "Short updates and long-form writing."}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col items-stretch gap-4 border-t border-border/60 pt-5">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="size-4" />
              {(post._count && post._count.comments) || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="size-4" />
              {(post._count && post._count.likes) || 0}
            </span>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isPending} size="icon" type="button" variant="ghost">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {post.state === "DRAFT" && (
                  <DropdownMenuItem onClick={() => handlePostChange("publish")}>
                    <Rocket />
                    Publish
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/blog/edit/${post.id}`}>
                    <Pencil />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePostChange("delete")}
                  variant="destructive"
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MostRecent;
