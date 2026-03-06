"use client";

import { createComment, patchComment } from "@/actions/CommentActions";
import { Loader2, MessageSquarePlus, PencilLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const CommentInput = ({
  data,
  mode,
  defaultContent,
  onCancel,
}: {
  defaultContent?: string;
  onCancel?: () => void;
  mode?: "edit";
  data: { userId: string | null; postId: string; commentId?: string };
}) => {
  const { userId, postId, commentId } = data;
  const [value, setValue] = useState(defaultContent ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleComment = async () => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 3) {
      toast.error("Comment needs at least 3 characters.");
      return;
    }

    if (!userId) {
      toast.error("You need to sign in before commenting.");
      return;
    }

    startTransition(async () => {
      if (mode === "edit") {
        if (!commentId) {
          toast.error("Comment could not be updated.");
          return;
        }

        try {
          await patchComment(commentId, postId, trimmedValue);
          onCancel?.();
          toast.success("Comment updated.");
          router.refresh();
        } catch (error) {
          console.log(error);
          toast.error("Comment could not be updated.");
        }
        return;
      }

      try {
        await createComment(postId, trimmedValue);
        toast.success("Comment saved.");
        setValue("");
        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error("Comment could not be saved.");
      }
    });
  };

  return (
    <div className="space-y-3">
      <Textarea
        onChange={(event) => setValue(event.target.value)}
        placeholder={
          mode === "edit"
            ? "Refine your comment."
            : "Add a thoughtful response to the article."
        }
        rows={mode === "edit" ? 4 : 5}
        value={value}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Write clearly, then submit when you are ready.
        </p>
        <div className="flex gap-2">
          {onCancel && mode === "edit" && (
            <Button onClick={onCancel} type="button" variant="ghost">
              <X />
              Cancel
            </Button>
          )}
          <Button disabled={isPending} onClick={handleComment} type="button">
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : mode === "edit" ? (
              <PencilLine />
            ) : (
              <MessageSquarePlus />
            )}
            {mode === "edit" ? "Save comment" : "Post comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
