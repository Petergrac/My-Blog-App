"use client";
import { postLikes } from "@/lib/postQueries";
import { cn } from "@/lib/utils";
import { HeartHandshake, ThumbsUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
const LikePost = ({
  hasLiked,
  likes,
  data,
}: {
  hasLiked: boolean;
  likes: number;
  data: { currentId: string | null; id: string };
}) => {
  const [like, setLike] = useState(likes);
  const [likeState, setLikeState] = useState(hasLiked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  //   Handle like update;
  const { currentId, id: postId } = data;

  const handleLikeUpdate = async () => {
    if (!currentId || !postId) {
      toast.warning("You can only like the post if you are logged in");
      return;
    }

    const previousLikeState = likeState;
    const nextLikeState = !previousLikeState;
    const nextLikeCount = like + (nextLikeState ? 1 : -1);

    setLikeState(nextLikeState);
    setLike(nextLikeCount);

    startTransition(async () => {
      try {
        await postLikes(postId, previousLikeState);
        router.refresh();
      } catch (error) {
        console.log(error);
        setLikeState(previousLikeState);
        setLike(like);
        toast.error("Could not update your reaction.");
      }
    });
  };

  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Reader reactions</p>
          <p className="text-sm text-muted-foreground">
            {like} {like === 1 ? "person appreciates this post." : "people appreciate this post."}
          </p>
        </div>
        <Button
          className={cn(
            "w-full sm:w-auto",
            likeState &&
              "border-sky-500/30 bg-sky-500/10 text-sky-700 hover:bg-sky-500/15"
          )}
          disabled={isPending}
          onClick={handleLikeUpdate}
          type="button"
          variant={likeState ? "outline" : "secondary"}
        >
          {likeState ? <HeartHandshake /> : <ThumbsUpIcon />}
          {likeState ? "Liked" : "Like this post"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LikePost;
