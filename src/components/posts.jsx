import { useRef, useState } from "react";
import gsap from "gsap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { addLike } from "../RESTapi/api";

function PostCard({ post }) {
  const [like, setLike] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const heartRef = useRef(null);

  const handleLike = async () => {
    setLike((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked((prev) => !prev);
    await addLike(post.id);
    gsap.fromTo(
      heartRef.current,
      { scale: 0.8, rotate: 0 },
      { scale: 1.2, rotate: 360, duration: 0.5, ease: "back.out(1.7)" }
    );
  };

  return (
    <div className="bg-slate-800 p-4 rounded-2xl card w-full sm:w-[48%] md:w-[30%] lg:w-[23%] flex flex-col justify-between shadow-lg border border-blue-400/30">
      {/* Title */}
      <h2 className="oswald text-xl md:text-2xl text-blue-300 mb-1 hover:underline">
        {post.title}
      </h2>

      {/* Content Preview */}
      <div
        className="inter text-sm text-white/70 max-h-24 overflow-hidden border-b border-blue-300/30 pb-2 mb-2"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author + Date */}
      <div className="flex justify-between text-xs text-white/40 mb-2">
        <p>By {post.author?.username || "Unknown"}</p>
        <p>
          {new Date(post.createdAt).toLocaleDateString("en-us", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Like and Comments */}
      <div className="flex justify-between items-center text-white/75 mb-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-red-400"
        >
          <FontAwesomeIcon
            icon={faHeart}
            ref={heartRef}
            className={`${
              hasLiked ? "text-red-500" : "text-red-300"
            } transition-transform`}
          />
          <span>{like}</span>
        </button>
        <p className="text-blue-400 text-sm">
          {post.comments.length} Comment{post.comments.length !== 1 && "s"}
        </p>
      </div>

      {/* Read More */}
      <NavLink
        to={`/post-detail/${post.id}`}
        className="btn text-center w-full"
      >
        Read More
      </NavLink>
    </div>
  );
}

export default PostCard;
