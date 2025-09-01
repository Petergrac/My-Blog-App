import AuthorHeader from "@/components/AuthorHeader";
import BlogAuthor from "@/components/BlogAuthor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const AuthorBlogs = async () => {
  // Check for authentication
  const { userId } = await auth();
  if (!userId) {
    redirect("/unauthorized");
  }
  // Get all the users post
  const posts = await prisma.post.findMany({
    where: {
      author: {
        clerkId: userId,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      state: true,
      coverImage: true,
      category: true,
      createdAt: true,
      accessKey: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      author: {
        select: {
          username: true,
          avatar: true,
          bio: true,
        },
      },
    },
  });
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full h-[70vh] text-center flex flex-col justify-center">
        <p className="text-2xl font-bold">You don&apos;t have any posts!</p>
        <Link
          href={`/new`}
          className="font-bold text-green-500 "
        >
          Click Here{" "}
        </Link>
        {"   "}to create a new post and you need to be an{" "}
        <span className="text-sky-700">Author</span>
        <p>
          If you are not an Author click on the account icon on top right and
          navigate to manage account <br /> And you can change your membership
          there.
        </p>
      </div>
    );
  }
  const author = posts[0].author!;
  const counts = posts.map((post) => post._count);
  return (
    <div className="sm:mx-10 mx-5  mb-5">
      {/* AUTHOR DETAILS */}
      <AuthorHeader postCount={counts} author={author} />
      {/* ALL BLOGS */}
      <div className="">
        <div className="">
          <h3 className="text-4xl py-5 text-center font-serif underline underline-offset-4 tracking-wider">
            Your Posts
          </h3>
          <BlogAuthor posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default AuthorBlogs;
