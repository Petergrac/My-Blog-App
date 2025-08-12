"use client";
import Aside from "@/components/Aside";
import BlogPost from "@/components/StaticRenderer";

const AllPosts = () => {
  return (
    <div className="md:mr-13 border-t-2 rounded-md py-2">
      <div>
        <h1 className="text-center font-bold text-2xl border-b-2 py-5 rounded-md">
          Your Blogs
        </h1>
        <div className="flex">
          <BlogPost />
          <div className="hidden md:block mr-5 mt-10 sticky top-20 h-fit">
            <Aside />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
