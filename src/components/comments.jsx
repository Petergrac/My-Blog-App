import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeComment, editComment, deleteComment } from "../RESTapi/api";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

function Comment({ comment }) {
  const queryClient = useQueryClient();
  const likeRef = useRef();
  const menuRef = useRef();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [content, setContent] = useState(comment.content);

  // Like comment mutation
  const { mutate, error } = useMutation({
    mutationFn: () => likeComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PostDetail"] });
      gsap.fromTo(
        likeRef.current,
        { scale: 0.8, rotate: 0 },
        { scale: 1.02, rotate: 360, duration: 0.4, ease: "back.out(2)" }
      );
    },
  });

  // Edit comment mutation
  const { mutate: editMutate, error: editError } = useMutation({
    mutationFn: () => editComment(content, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PostDetail"] });
    },
  });
  // Delete comment mutation
  const { mutate: deleteMutate, error: deleteErrors } = useMutation({
    mutationFn:()=> deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PostDetail"] });
    },
  });
  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  //   Edit related errors
  if (editError) {
    const status = error?.response?.status;
    if (status === 401) return navigate("/login");
    if (status === 404) return <p>Comment not found.</p>;
  }
  // Auth-related error
  if (error) {
    const status = error?.response?.status;
    if (status === 401) return navigate("/login");
    if (status === 404) return <p>Comment not found.</p>;
  }
  //   Delete-related errors
  if (deleteErrors) {
    const status = error?.response?.status;
    if (status === 401) return navigate("/login");
    if (status === 404) return <p>Comment not found.</p>;
  }
  const handleLike = () => {
    mutate();
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  //   Submit the updated comment
  const commentEdit = () => {
    editMutate();
    setEdit(false);
  };

  // Placeholder handlers for edit and delete
  const handleEdit = () => {
    const userId = localStorage.getItem("currentUser");
    if (comment.user.id === userId) {
      setEdit(true);
      setMenuOpen(false);
    }
  };

  const handleDelete = () => {
    const userId = localStorage.getItem("currentUser");
    if (comment.user.id === userId) {
      deleteMutate();
      setMenuOpen(false);
    }
  };

  const createdTime = new Date(comment.createdAt).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="pb-5 border-b border-[#beef00] pt-3 relative">
      <div className="flex flex-col md:flex-row justify-between">
        {edit ? (
          <input
            onChange={handleChange}
            className="input h-16 w-1/2"
            value={content}
            onKeyDown={(e) => {
              if (e.key === "Enter") commentEdit();
            }}
            onBlur={commentEdit}
          />
        ) : (
          <p>{content}</p>
        )}

        {/* Dropdown trigger button */}
        <div className="relative flex justify-end" ref={menuRef}>
          <button
            className="text-2xl font-bold px-2"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ⋮
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-gray-800 border border-gray-600 rounded shadow-md z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 py-4">
        <p className="bg-slate-700 px-2 rounded-sm h-8 items-center flex ">{comment.user.username}</p>
        <button
          ref={likeRef}
          onClick={handleLike}
          className="font-bold text-[#beef00] border p-1 rounded-sm "
        >
          Likes: <span className="text-cyan-400">{comment.likes}</span>
        </button>
        <p className="font-bold text-[#caef00]/75">{createdTime}</p>
      </div>
    </div>
  );
}

export default Comment;
