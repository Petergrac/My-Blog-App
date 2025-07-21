import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

import { getPostById, postAComment, addLike } from "../RESTapi/api";
import Comment from "../components/comments";
import Footer from "../components/footer";
import "../styles/App.css";
import { useGSAP } from "@gsap/react";
import Loading from "../components/Loading";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postRef = useRef();
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const [comment, setComment] = useState("");

  // Fetch post data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["PostDetail", id],
    queryFn: () => getPostById(id),
  });

  // Post comment mutation
  const { mutate: postComment, error: commentError } = useMutation({
    mutationFn: () => postAComment(comment, id),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["PostDetail", id] });
    },
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: () => addLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PostDetail", id] });

      gsap.fromTo(
        postRef.current,
        { scale: 0.7, rotateY: 0 },
        {
          scale: 1.05,
          rotateY: 360,
          duration: 0.6,
          ease: "back.out(2)",
        }
      );
    },
  });

  // Animation
  useGSAP(() => {
    gsap.from(titleRef.current, {
      duration: 0.5,
      y: 200,
      rotation: 360,
      ease: "power2.out",
    });
  }, []);
  useEffect(() => {
    if (!data?.content || !contentRef.current) return;
    const split = new SplitText(contentRef.current, { type: "lines" });

    gsap.from(split.lines, {
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 95%",
        end: "bottom 10%",
        toggleActions: "play none none none",
        scrub: true,
      },
      opacity: 0.6,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    });

    return () => {
      split.revert(); // Clean up when unmounting
    };
  }, [data?.content]);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      postComment();
    }
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>{error.message}</div>;
  // Content animation

  // Handle comment error (like 401, 404, etc.)
  if (commentError) {
    const code = commentError.response?.status;
    if (code === 401) navigate("/login");
    else if (code === 404) return <div>Post not found</div>;
    else return <div>Error posting comment</div>;
  }
  const { title, content, likes, author, createdAt, comments } = data;

  return (
    <div className="post-container">
      <p ref={titleRef} className="title gothic">
        {title}
      </p>

      <div
        ref={contentRef}
        className="inter text-lg px-5 md:px-20 pb-10 border-b border-slate-200"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>

      <div className="pl-2 py-3 md:py-10 md:flex md:items-end gap-4 md:flex-col md:pr-10">
        <button
          ref={postRef}
          onClick={handleLike}
          className="text-lg border p-1 rounded-sm hover:translate-y-0.5 font-bold text-[#beef00]"
        >
          Likes: <span className="text-cyan-400 font-bold">{likes}</span>
        </button>
        <p className="font-bold text-teal-300 md:text-lg">{author.username}</p>
        <p className="text-lg font-bold">
          Created at:{" "}
          {new Date(createdAt).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="comment-section">
        <p className="pl-5">Add A Comment</p>
        <label htmlFor="comment" className="flex justify-center bg-slate-800">
          <textarea
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCommentSubmit();
            }}
            onBlur={handleCommentSubmit}
            className="textarea"
          ></textarea>
        </label>
      </div>

      <div>
        <p className="pl-2 text-2xl font-bold md:pl-8">Comments:</p>
        <div className="flex p-5 flex-col">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default PostDetail;
