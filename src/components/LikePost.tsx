"use client";
import { postLikes } from "@/lib/postQueries";
import { ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
  //   Handle like update;
  const { currentId, id: postId } = data;

  const handleLikeUpdate = async () => {
    if (currentId && postId) {
      if (hasLiked && like > 0) {
        setLike((prev) => prev - 1);
        setLikeState((prev) => !prev);
        //   Remove the like
        try {
          await postLikes(currentId, postId, hasLiked);
        } catch (error) {
          console.log(error);
          toast.error("Could not like the post");
        }
      } else {
        // Add like
        setLike((prev) => prev + 1);
        setLikeState((prev) => !prev);
        try {
          await postLikes(currentId, postId, hasLiked);
        } catch (error) {
          console.log(error);
          toast.error("Could not like the post");
        }
      }
    } else {
      toast.warning("You can only like the post if you are logged in");
    }
  };

  return (
    <div className="flex py-4 items-center gap-2 justify-end">
      <p>Likes:</p>
      <div
        className={`${
          likeState ? "text-sky-500" : "hover:text-sky-500"
        } anim flex items-center gap-1`}
        onClick={handleLikeUpdate}
      >
        <ThumbsUpIcon size={20} />
        <span className="">{like}</span>
      </div>
    </div>
  );
};

export default LikePost;
