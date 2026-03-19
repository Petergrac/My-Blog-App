"use server";
import { directPrisma } from "@/lib/prisma";
import { auth } from "@/auth";
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
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Unauthorized" };
  }

  // Get user id
  const author = await directPrisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
    },
  });
  if (!author) throw new Error("You must be an author in order to post");
  if (author.role !== "Author" && author.role !== "Admin") {
    throw new Error("You must be an author in order to post");
  }
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
        authorId: author.id,
      },
    });
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
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const author = await directPrisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!author) {
      throw new Error("Only authors can update posts.");
    }
    if (author.role !== "Author" && author.role !== "Admin") {
      throw new Error("Only authors can update posts.");
    }

    const post = await directPrisma.post.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
        category: true,
      },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.authorId !== author.id) {
      throw new Error("You can only update your own posts.");
    }

    await directPrisma.post.update({
      where: {
        id: id,
      },
      data: {
        ...updatedPost,
      },
      select: {
        id: true,
        category: true,
      },
    });
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
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const author = await directPrisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!author) {
      throw new Error("Only authors can delete posts.");
    }
    if (author.role !== "Author" && author.role !== "Admin") {
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
