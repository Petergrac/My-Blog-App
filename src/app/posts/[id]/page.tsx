"use client";
import BlogPost from "@/components/StaticRenderer";

const AllPosts = () => {
  return (
    <div className="mx-auto  md:w-[94vw] border-t-2 rounded-md py-2">
      <div>
        <h1 className="text-center font-bold text-2xl border-b-2 py-5 rounded-md">
          Your Blogs
        </h1>
        <BlogPost />
      </div>
    </div>
  );
};

export default AllPosts;
