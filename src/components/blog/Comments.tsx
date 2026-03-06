"use client";

import { deleteComment } from "@/actions/CommentActions";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import CommentInput from "@/components/blog/CommentInput";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    username: string | null;
    avatar: string | null;
  };
  postId: string;
}[];

const Comments = ({
  comments,
  userId,
  postId,
}: {
  comments: Comment;
  userId: string | null;
  postId: string;
}) => {
  const [change, setChange] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async (commentId: string) => {
    startTransition(async () => {
      try {
        await deleteComment(commentId, postId);
        setChange(null);
        toast.success("Comment deleted.");
        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error("Comment could not be deleted.");
      }
    });
  };

  return (
    <section className="space-y-6">
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Badge className="w-fit" variant="outline">
                Discussion
              </Badge>
              <CardTitle className="text-2xl">Comments</CardTitle>
              <CardDescription>
                {comments.length === 0
                  ? "Start the conversation around this story."
                  : `${comments.length} comment${comments.length === 1 ? "" : "s"} so far.`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {userId ? (
            <CommentInput data={{ userId, postId }} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Join the discussion</p>
              <p className="mt-2">
                You need to sign in before you can post or edit comments.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/sign-in">Sign in to comment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner = userId === comment.author.id;

            return (
              <Card
                className="border-border/70 bg-card/95 shadow-sm"
                key={comment.id}
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border/60">
                      <Image
                        alt={comment.author.username || "Comment author"}
                        className="object-cover"
                        fill
                        src={comment.author.avatar || "/noAvatar.jpg"}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex justify-between gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-medium">
                            {comment.author.username || "Anonymous reader"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {isOwner && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" type="button" variant="ghost">
                                <MoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setChange((current) =>
                                    current === comment.id ? null : comment.id
                                  )
                                }
                              >
                                <Pencil />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isPending}
                                onClick={() => handleDelete(comment.id)}
                                variant="destructive"
                              >
                                <Trash2 />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <p className="whitespace-pre-line text-sm leading-7 text-foreground/90">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  {change === comment.id && (
                    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                      <CommentInput
                        data={{ userId, postId, commentId: comment.id }}
                        defaultContent={comment.content}
                        key={comment.id}
                        mode="edit"
                        onCancel={() => setChange(null)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
            <div className="rounded-full bg-muted p-3">
              <MessageSquare className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No comments yet</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Be the first reader to add context, ask a question, or highlight
                a useful takeaway from this post.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default Comments;
