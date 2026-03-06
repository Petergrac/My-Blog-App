"use server";
import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";

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


/**
 *  ==================== LIKE & DISLIKE A POST ================
 * @param postId
 * @param userId
 * @param likeStatus
 */

export async function postLikes(postId: string, likeStatus: boolean) {
  try {
    const { userId } = await auth();

    if (!userId) {
      await auth.protect();
      return;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      throw new Error("Only registered users can like posts.");
    }

    if (likeStatus) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId: currentUser.id,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: currentUser.id,
        },
      });
    }
  } catch (error) {
    console.error("Failed to update like:", error);
    throw error;
  }
  revalidatePath(`/blog/${postId}`);
}
