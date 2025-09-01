import MostRecent from "@/components/MostRecent";
import PostNotFound from "@/components/PostNotFound";
import prisma from "@/lib/prisma";
import Image from "next/image";


const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const { type } = await params;

  const posts = await prisma.post.findMany({
    where: {
      category: type,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      title: true,
      id: true,
      createdAt: true,
      coverImage: true,
      description: true,
      category: true,
      author: {
        select: {
          username: true,
          bio: true,
          avatar: true,
        },
      },
    },
  });
  if (!posts || posts.length === 0) {
    return <PostNotFound />;
  };

  return (
    <div className="mb-10">
      {/* HERO SECTION */}
      <div className="relative aspect-[5/1] w-full">
        <Image src="/categories.jpg" alt="" fill className="object-cover" />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-200 z-10">
          Explore posts by category
        </h1>
      </div>
      {/* POSTS BY CATEGORY CLICKED */}
      <h1 className="sm:text-4xl text-2xl text-center py-10 underline">{type.toUpperCase()}</h1>
      <div className="flex gap-5 flex-wrap sm:mx-auto mx-5">
        {posts.map(post=>(
          <MostRecent key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
