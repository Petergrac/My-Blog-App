"use server";
import { revalidatePath } from "next/cache";

import { requireCurrentDatabaseUser } from "@/lib/current-user";
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


/**
 *  ==================== LIKE & DISLIKE A POST ================
 * @param postId
 * @param userId
 * @param likeStatus
 */

export async function postLikes(postId: string, likeStatus: boolean) {
  try {
    const currentUser = await requireCurrentDatabaseUser();
    if (likeStatus) {
      await prisma.like.deleteMany({
        where: {
          postId,
          userId: currentUser.id,
        },
      });
    } else {
      await prisma.like.upsert({
        where: {
          postId_userId: {
            postId,
            userId: currentUser.id,
          },
        },
        update: {},
        create: {
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
