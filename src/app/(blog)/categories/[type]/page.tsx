import CagegoryLinks from "@/components/CagegoryLinks";
import MostRecent from "@/components/MostRecent";
import PostNotFound from "@/components/PostNotFound";
import prisma from "@/lib/prisma";
import Image from "next/image";

export const revalidate = 60;

// Static generation for SSG
export async function generateStaticParams() {
  const categories = await prisma.post.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
  });

  return categories.map((cat) => ({
    type: cat.category,
  }));
}

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
    return (
      <div className="mt-10">
        <CagegoryLinks />
        <PostNotFound />;
      </div>
    );
  }

  return (
    <div className="mb-10 min-h-[75vh]">
      {/* HERO SECTION */}
      <div className="relative aspect-[5/1] w-full">
        <Image src="/categories.jpg" alt="" fill className="object-cover" />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-200 z-10">
          Explore posts by category
        </h1>
      </div>
      {/* POSTS BY CATEGORY CLICKED */}
      <h1 className="sm:text-4xl  text-2xl text-center py-10 underline">
        {type.toUpperCase()}
      </h1>
      <div className="flex overflow-x-auto gap-5 sm:mx-auto mx-5">
        {posts.map((post) => (
          <MostRecent key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
