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
      },
      include: {
        author: {
          select: {
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
