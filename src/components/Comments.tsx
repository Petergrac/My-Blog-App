"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import CommentInput from "./CommentInput";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { deleteComment } from "@/actions/CommentActions";
import { toast } from "sonner";

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
  const [change, setChange] = useState<null | {
    id: string;
    type: "edit" | "delete";
  }>(null);

  const commentActions = async (type: "edit" | "delete", commentId: string) => {
    if (type === "delete") {
      try {
        await deleteComment(commentId, postId);
        toast.success("Comment deleted!");
      } catch (error) {
          console.log(error)
        toast.error("Comment could not be deleted");
      }
    }
    setChange({ id: commentId, type });
  };

  return (
    <div>
      {/* Always show input at the top if user is logged in */}
      {userId && <CommentInput data={{ userId, postId }} />}

      <div className="space-y-6 mt-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-2">
            <div className={`${
                  userId && userId === comment.author.id && "flex-row-reverse"
                } flex items-center gap-4`}>
              {/* Avatar */}
              <div className="w-10 h-10 relative rounded-full overflow-hidden">
                <Image
                  src={comment.author.avatar || "/noAvatar.jpg"}
                  alt={comment.author.username || ""}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Comment body */}
              <div
                className={`flex-1 bg-muted px-4 py-3 rounded-md`}
              >
                <div className={` flex justify-between items-center mb-1`}>
                  <span className="font-semibold text-sm text-foreground">
                    {comment.author.username}
                  </span>
                  <div className="flex flex-col items-end gap-4">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {userId && userId === comment.author.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="outline-none">
                          <MoreVertical size={15} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => commentActions("edit", comment.id)}
                            className="text-sm"
                          >
                            <Pencil size={14} className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => commentActions("delete", comment.id)}
                            className="text-rose-500 text-sm"
                          >
                            <Trash size={14} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </div>

            {/* Inline Comment Input for edit/delete */}
            {change && change.id === comment.id && change.type === "edit" && (
              <div className="ml-14">
                <CommentInput
                  data={{ userId, postId, commentId: comment.id }}
                  mode={"edit"}
                  defaultContent={comment.content}
                  onCancel={() => setChange(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
