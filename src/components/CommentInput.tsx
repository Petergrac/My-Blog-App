"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { createComment, patchComment } from "@/actions/CommentActions";

const CommentInput = ({
  data,
  mode,
  defaultContent,
  onCancel,
}: {
  defaultContent?: string;
  onCancel?: () => void;
  mode?: "edit" | "delete";
  data: { userId: string | null; postId: string; commentId?: string };
}) => {
  const { userId, postId, commentId } = data;
  const [value, setValue] = useState("");

  if (mode === "delete" && commentId) {
    return;
  }
  // Create a new comment
  const handleComment = async () => {
    if (value.length > 2 && userId && mode !== "edit" && mode !== "delete") {
      try {
        await createComment(userId, postId, value);
        toast.success("Comment saved");
        setValue("");
        defaultContent = value;
      } catch (error) {
        console.log(error);
        toast.error("Comment could not be saved");
      }
    }
    if (mode && mode === "edit") {
      if (value.length > 2 && userId && commentId) {
        try {
          await patchComment(commentId, value);
          if (onCancel) onCancel();
          toast.success("Comment updated");
          setValue("");
          defaultContent = value;
        } catch (error) {
          console.log(error);
          toast.error("Comment could not be updated");
        }
      }
    }
  };
  return (
    <div className="ml-13 mt-5">
      {onCancel && mode === "edit" && (
        <button
          className="flex justify-end pr-5 hover:text-red-500 w-full mr-5"
          onClick={onCancel}
        >
          x
        </button>
      )}
      <Textarea
        placeholder="Comment here"
        defaultValue={defaultContent || value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleComment}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // prevents newline insertion
            handleComment();
          }
        }}
      />
    </div>
  );
};

export default CommentInput;
