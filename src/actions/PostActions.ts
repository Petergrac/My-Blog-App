"use server";
import {
  accelerateTags,
  invalidateAccelerateTags,
} from "@/lib/prisma-cache";
import { directPrisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * ================= CREATE A POST ============
 * @param finalPost - The post data to be saved.
 */
interface finalPost {
  title: string;
  category: string;
  coverImage: string;
  state: "PUBLISHED" | "DRAFT";
  content: string;
  description: string;
}
interface editPost{
  title?: string;
  category?: string;
  coverImage?: string;
  state?: "PUBLISHED" | "DRAFT";
  content?: string;
  description?: string;
}
export async function newPost(finalPost: finalPost) {
  const { userId } = await auth();

  if (!userId) {
    return auth.protect();
  }

  // Get user id
  const authorId = await directPrisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
    },
  });
  if (!authorId) throw new Error("You must be an author in order to post");
  // Post the data
  try {
    const createdPost = await directPrisma.post.create({
      data: {
        title: finalPost.title,
        content: finalPost.content,
        category: finalPost.category,
        description: finalPost.description,
        state: finalPost.state,
        coverImage: finalPost.coverImage,
        authorId: authorId.id,
      },
    });
    if (createdPost.state === "PUBLISHED") {
      await invalidateAccelerateTags([
        accelerateTags.publicPosts,
        accelerateTags.post(createdPost.id),
        accelerateTags.category(createdPost.category),
      ]);
    }
    revalidatePath('/');
    revalidatePath(`/blog/${createdPost.id}`);
    revalidatePath(`/categories/${encodeURIComponent(createdPost.category)}`);
    return {
      message: "Post created successfully!",
      data: createdPost,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

/**
 * =============  PATCH A POST ==============
 *
 */
export async function patchPost(updatedPost: editPost, id: string) {
  const { userId } = await auth();

  if (!userId) {
    return auth.protect();
  }

  try {
    const author = await directPrisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!author) {
      throw new Error("Only authors can update posts.");
    }

    const post = await directPrisma.post.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
        category: true,
        state: true,
      },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== author.id) {
      throw new Error("You can only update your own posts.");
    }

    const savedPost = await directPrisma.post.update({
      where: {
        id: id,
      },
      data: {
        ...updatedPost,
      },
      select: {
        id: true,
        category: true,
        state: true,
      },
    });
    if (post.state === "PUBLISHED" || savedPost.state === "PUBLISHED") {
      await invalidateAccelerateTags([
        accelerateTags.publicPosts,
        accelerateTags.post(id),
        accelerateTags.category(post.category),
        accelerateTags.category(savedPost.category),
      ]);
    }
    revalidatePath("/");
    revalidatePath("/blog/my-blogs");
    revalidatePath(`/blog/${id}`);
    revalidatePath(`/categories/${encodeURIComponent(post.category)}`);
    if (updatedPost.category) {
      revalidatePath(`/categories/${encodeURIComponent(updatedPost.category)}`);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deletePost(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return auth.protect();
  }

  try {
    const author = await directPrisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!author) {
      throw new Error("Only authors can delete posts.");
    }

    const post = await directPrisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        authorId: true,
        category: true,
        state: true,
      },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== author.id) {
      throw new Error("You can only delete your own posts.");
    }

    await directPrisma.$transaction([
      directPrisma.like.deleteMany({
        where: {
          postId: id,
        },
      }),
      directPrisma.comment.deleteMany({
        where: {
          postId: id,
        },
      }),
      directPrisma.post.delete({
        where: {
          id,
        },
      }),
    ]);

    if (post.state === "PUBLISHED") {
      await invalidateAccelerateTags([
        accelerateTags.publicPosts,
        accelerateTags.post(id),
        accelerateTags.category(post.category),
      ]);
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/my-blogs");
    revalidatePath(`/blog/${id}`);
    revalidatePath(`/categories/${encodeURIComponent(post.category)}`);

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
