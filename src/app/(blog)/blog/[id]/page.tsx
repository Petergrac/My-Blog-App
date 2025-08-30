import StaticRenderer, { initialTOC } from "@/components/StaticRenderer";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { JSONContent } from "@tiptap/react";
import { Metadata } from "next";
import { getPost } from "@/lib/postQueries";
import { notFound } from "next/navigation";
import ActiveToc from "@/components/TOC";

// FETCH ALL STATIC POSTS
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  return posts.map((post) => ({
    id: post.id,
  }));
}

// Generating the metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    notFound();
  }
  // Generate the metadata from the post
  return {
    title: post.title,
    description: post.description,
  };
}

// Revalidate Post
export const revalidate = 60;

interface PostType {
  type: string;
  content: JSONContent[];
}

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Access the id directly from the params object without using await
  const { id } = await params;

  // Fetch a specific post
  const post = await getPost(id);

  if (!post || !post.content) {
    return <div className="">Post not found</div>;
  }

  const PostContent = JSON.parse(post.content) as PostType;
  const toc = initialTOC;
  return (
    <div className="py-10 mx-auto md:max-w-[90vw] lg:max-w-[90vw]">
      {/* TITLE */}
      <div className="pb-5 border-b-[1px] shadow-md">
        <h1 className="sm:text-4xl underline underline-offset-4 text-2xl text-center">
          {post?.title}
        </h1>
        <div className="flex mx-auto w-fit gap-10 py-4  justify-center">
          <p className="text-sm text-center">
            {post?.createdAt.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-sm bg-fuchsia-600 rounded-sm p-[1px] text-white w-fit text-center">
            {post?.category.toUpperCase()}
          </p>
        </div>
      </div>
      {/* CONTENT */}
     
       <div className="flex gap-4">
         <StaticRenderer content={PostContent} />
         {toc && <ActiveToc toc={toc} />}
       </div>
      {/* ABOUT THE AUTHOR */}
      <div className="border-t-3 py-4">
        {/* AVATAR */}
        <Image
          src={post.author.avatar || "/noAvatar.jpeg"}
          alt=""
          width={100}
          height={100}
          className="aspect-square overflow-hidden rounded-full mx-auto"
        />
        <p className="text-sm text-center py-3  font-sans font-bold">
          {post.author.username || "Unknown"}
        </p>
        <p className="text-center font-light tracking-tighter text-xs w-72 mx-auto">
          {post.author.bio || "No bio provided"}
        </p>
      </div>
    </div>
  );
};
export default PostPage;
