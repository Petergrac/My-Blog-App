"use server";
import { revalidatePath } from "next/cache";

import { requireCurrentDatabaseUser } from "@/lib/current-user";
import { directPrisma } from "./prisma";

export type PublicPost = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  coverImage: string;
  createdAt: Date;
  author: {
    id: string;
    username: string | null;
    avatar: string | null;
    bio: string | null;
    country: string | null;
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    postId: string;
    author: {
      username: string | null;
      avatar: string | null;
      id: string;
    };
  }>;
  likes: Array<{
    userId: string;
    postId: string;
  }>;
};

/**
 *  ================ Get a single post ===========
 * @param id This is to get a single post using the id
 * @returns post
 */
export async function getPost(id: string): Promise<PublicPost | null> {
  try {
    const post = await directPrisma.post.findUnique({
      where: {
        id: id,
        state: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        category: true,
        coverImage: true,
        createdAt: true,
        author: {
          select: {
            id: true,
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
    }) as PublicPost | null;
    
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
      await directPrisma.like.deleteMany({
        where: {
          postId,
          userId: currentUser.id,
        },
      });
    } else {
      await directPrisma.like.upsert({
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
