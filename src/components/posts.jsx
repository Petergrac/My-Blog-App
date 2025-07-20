import { useRef, useState } from "react";
import gsap from "gsap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { addLike } from "../RESTapi/api";

function PostCard({ post }) {
  const [like, setLike] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const heartRef = useRef(null); // ✅ ref for the heart icon

  const handleLike = async () => {
    setLike((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked((prev) => !prev);
    await addLike(post.id);
    gsap.fromTo(
      heartRef.current,
      { scale: 0.7, rotateY: 0 },
      {
        scale: 1.4,
        rotateY: 360,
        duration: 0.6,
        ease: "back.out(2)",
      }
    );
  };
  return (
    <div className="bg-zinc-800 p-5 card rounded-lg shadow-lg w-full sm:w-[48%] md:w-[30%] lg:w-[24%]">
      {post.imageUrl === null ? (
        ""
      ) : (
        <img
          src="/"
          className="rounded w-full h-40 object-cover mb-3"
          alt={post.title}
        />
      )}
      <h1 className="oswald md:text-xl text-blue-400 text-lg">{post.title}</h1>
      <div
        className="inter max-h-20 mb-2 overflow-hidden text-white/65 border-b border-blue-400/65"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleLike}
          className="text-white/75 flex items-center gap-1"
        >
          <FontAwesomeIcon
            icon={faHeart}
            ref={heartRef}
            className="text-red-500"
          />
          <span>{like}</span>
        </button>
        <p className="text-blue-400/75 text-sm">
          Comments {post.comments.length}
        </p>
      </div>
      <NavLink
        className={
          "text-white/55 hover:underline text-center border mt-10 p-1 rounded-md"
        }
        to={`/post-detail/${post.id}`}
      >
        Read More
      </NavLink>
    </div>
  );
}

export default PostCard;
