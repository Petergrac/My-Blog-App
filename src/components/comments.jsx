import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeComment } from "../RESTapi/api";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";

function Comment({ comment }) {
  const queryClient = useQueryClient();
  const likeRef = useRef();
  const navigate = useNavigate();
  // Like comment mutation
  const { mutate, error } = useMutation({
    mutationFn: () => likeComment(comment.id),
    onSuccess: () => {
      // Refetch comments (or entire post if they are nested)
      queryClient.invalidateQueries({ queryKey: ["PostDetail"] });

      // Animate like button
      gsap.fromTo(
        likeRef.current,
        { scale: 0.8, rotate: 0 },
        { scale: 1.02, rotate: 360, duration: 0.4, ease: "back.out(2)" }
      );
    },
  });
  if (error) {
    if (error.status == 401) {
      return navigate("/login");
    }
    if (error.status == 404) {
      return <p>Comment not found.</p>;
    }
  }
  const handleLike = () => {
    mutate();
  };

  const createdTime = new Date(comment.createdAt).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="pb-5 border-b border-[#beef00] pt-3">
      <p>{comment.content}</p>
      <div className="flex justify-end gap-3 py-4">
        <p className="bg-slate-700 px-2 rounded-sm">{comment.user.username}</p>
        <button
          ref={likeRef}
          onClick={handleLike}
          className="font-bold text-[#beef00] border p-1 rounded-sm"
        >
          Likes: <span className="text-cyan-400">{comment.likes}</span>
        </button>
        <p className="font-bold text-[#caef00]/75">{createdTime}</p>
      </div>
    </div>
  );
}

export default Comment;
