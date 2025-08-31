"use server"
import { revalidatePath } from "next/cache";
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
            id: true,
            clerkId: true,
            username: true,
            avatar: true,
            bio: true,
            country: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            postId: true,
            author: {
              select: {
                username: true,
                avatar: true,
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          select: {
            userId: true,
            postId: true,
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

/**
 *  ==================== LIKE & DISLIKE A POST ================
 * @param postId
 * @param userId
 * @param likeStatus
 */

export async function postLikes(
  userId: string,
   postId: string,
  likeStatus: boolean
) {
  console.log("This funct has been executed");

  try {
    if (likeStatus) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (error) {
    console.error("Failed to update like:", error);
    throw error;
  }
  revalidatePath(`/blog/${postId}`);
}