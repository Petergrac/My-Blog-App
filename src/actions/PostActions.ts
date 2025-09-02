"use server";
import prisma from "@/lib/prisma";
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
  const authorId = await prisma.user.findUnique({
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
    const createdPost = await prisma.post.create({
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
    revalidatePath('/');
    revalidatePath(`/blog/${createdPost.id}`);
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
  try {
    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        ...updatedPost,
      },
    });
    revalidatePath(`/blog/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deletePost(id: string) {
  try {
    const deletedPost = await prisma.post.delete({
      where:{
        id: id
      }
    });
    revalidatePath('/blog')
    return !!deletedPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
