"use client";
import { useState } from "react";
import MostRecent from "./MostRecent";
import Link from "next/link";

export type PostType = {
    title: string;
    id: string;
    createdAt: Date;
    category: string;
    coverImage: string;
    description: string;
    state?: 'PUBLISHED' | 'DRAFT';
    accessKey?: string;
    author: {
        username: string | null;
        bio: string | null;
        avatar: string | null;
    };
    _count?: {
        comments: number;
        likes: number;
    };
}

const BlogAuthor = ({ posts }: { posts: PostType[] }) => {
  const [postState, setState] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const filteredPosts = posts.filter((post) => post.state === postState);
  return (
    <div className="">
      <nav className="flex justify-between font-bold ">
        <p
          onClick={() => setState("PUBLISHED")}
          className={`${
            postState === "PUBLISHED" && "text-amber-400"
          } anim cursor-pointer`}
        >
          Published
        </p>
        <p
          onClick={() => setState("DRAFT")}
          className={`${
            postState === "DRAFT" && "text-amber-400"
          } anim cursor-pointer`}
        >
          Drafts
        </p>
      </nav>
      {/* Blogs base on the state */}
      <p className={`text-center text-lg font-serif `}>
        Your{" "}
        <span
          className={`${
            postState === "PUBLISHED"
              ? "text-lime-500 underline decoration-lime-500"
              : "text-yellow-600 underline decoration-yellow-500"
          }`}
        >
          {postState.toLowerCase()}
        </span>{" "}
        Posts
      </p>
      {filteredPosts.length > 0 ? (
        <div className="flex gap-5 flex-wrap mt-5 pt-5 border-t-2">
          {filteredPosts.map((post) => (
            <MostRecent key={post.id} post={post} isAuthor={true} />
          ))}
        </div>
      ) : (
        <div className="">
          <p className="text-lg text-center py-50">
            You don&apos;t have any posts.
            <br />
            Create a new post{" "}
            <Link
              href={`/new`}
              className="anim text-sky-500 hover:text-sky-700"
            >
              here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogAuthor;
