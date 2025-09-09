import StaticRenderer from "@/components/StaticRenderer";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { JSONContent } from "@tiptap/react";
import { Metadata } from "next";
import { getPost } from "@/lib/postQueries";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import LikePost from "@/components/LikePost";
import { auth } from "@clerk/nextjs/server";

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
    notFound();
  }
  const { userId } = await auth();
  // Check if the user has liked the post
  let hasLiked = [];
  let currentId: string | null = null;
  if (userId) {
    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });
    if (currentUser) {
      currentId = currentUser.id;
    }
    hasLiked = post.likes.filter(
      (user) => user.userId === currentUser?.id && user.postId === id
    );
  }
  const postComments = post.comments;
  // Get content
  const PostContent = JSON.parse(post.content) as PostType;
  return (
    <div className="py-5 mx-auto md:max-w-[90vw] lg:max-w-[90vw]">
      {/* TITLE */}
      <div className=" border-b-[1px] shadow-md">
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
      <StaticRenderer content={PostContent} />
      {/* Likes */}
      <div className="">
        <LikePost
          data={{ currentId, id }}
          hasLiked={hasLiked.length > 0}
          likes={post.likes.length}
        />
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
        <div className="flex flex-col justify-center gap-1 mb-3 items-center">
          <p className="text-sm text-center pt-3  font-sans font-bold">
            {post.author.username || "Unknown"}
          </p>
          <p className="text-xs text-center">
            {post.author.country ? (
              <span className="italic font-bold bg-lime-700 p-[1px] rounded-xs">
                {post.author.country}
              </span>
            ) : (
              <span className="italic font-extralight ">Anonymous</span>
            )}
          </p>
          <div className="flex gap-2 items-center w-72 justify-center pt-2">
            <hr className="border-1 grow flex" />
            <hr className="border-1 grow flex" />
          </div>
        </div>
        <p className="text-center font-light tracking-tighter text-xs w-72 mx-auto">
          {post.author.bio || "No bio provided"}
        </p>
      </div>
      {/* COMMENTS */}
      <div className="">
        <h1 className="text-2xl text-center py-5 w-full border-b-2 underline">
          Comments
        </h1>
      </div>
      <Comments userId={currentId} postId={id} comments={postComments} />
    </div>
  );
};
export default PostPage;

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
