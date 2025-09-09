import CagegoryLinks from "@/components/CagegoryLinks";
import FeaturedPost from "@/components/FeaturedPost";
import MostRecent from "@/components/MostRecent";
import NoPosts from "@/components/NoPosts";
import prisma from "@/lib/prisma";

export const revalidate = 60;
export default async function Home() {
  const latestPosts = await prisma.post.findMany({
    where: { state: "PUBLISHED" },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
      category: true,
      createdAt: true,
      author: {
        select: {
          username: true,
          bio: true,
          avatar: true,
        },
      },
    },
  });
  const posts = latestPosts;
  if (posts.length === 0) {
    return (
      <div>
        <CagegoryLinks />
        <NoPosts />
      </div>
    );
  }
  const filteredPost = posts.filter((post) => post.category === "testing");
  return (
    <div>
      {/* CATEGORIES */}
      <CagegoryLinks />
      {/* FEATURED */}
      <div className="mt-10 mb-5 max-w-[1080px] mx-auto">
        <p className="text-center text-lg pb-5 underline underline-offset-5">
          Featured Posts
        </p>
        <div className="">
          {filteredPost.length > 0 ? (
            <div className="grids gap-4 md:m-5 m-2">
              {filteredPost.map((post) => (
                <FeaturedPost post={post} key={post.id} />
              ))}
            </div>
          ) : (
            <div className="py-10 flex justify-center items-center">
              <p className="text-2xl text-muted-foreground font-bold">
                No Featured Posts Posted
              </p>
            </div>
          )}
        </div>
      </div>
      {/* RECENT POSTS*/}
      <div className="mt-5 mb-10 max-w-[1080px] mx-auto">
        <p className="text-lg text-center underline underline-offset-5">
          Most Recent
        </p>
        <div className="">
          {posts.length > 0 ? (
            <div className="mostGrids gap-2 gap-y-5 mt-5">
              {posts.map((post) => (
                <MostRecent key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-10 flex justify-center items-center">
              <p className="text-2xl text-muted-foreground font-bold text-center">
                No Posts Posted, Be the first to post something!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
