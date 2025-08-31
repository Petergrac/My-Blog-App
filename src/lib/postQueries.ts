import prisma from "./prisma";

/**
 *  ================ Get a single post ===========
 * @param id This is to get a single post using the id
 * @returns post
 */
export async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
        state: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            clerkId: true,
            username: true,
            avatar: true,
            bio: true,
            country: true,
          },
        },
      },
    });
    return post;
  } catch (err) {
    throw err;
  }
}

export async function getLatestPost() {
  try {
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
    return latestPosts;
  } catch (error) {
    throw error;
  }
}
