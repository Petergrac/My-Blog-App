"use server";
import { Post } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * ================= CREATE A POST ============
 * @param finalPost - The post data to be saved.
 */
interface finaPost extends Post {
  title: string;
  category: string;
  coverImage: string;
  state: "PUBLISHED" | "DRAFT";
  content: string;
  description: string;
}

export async function newPost(finalPost: finaPost) {
  const user = await currentUser();

  if (!user) {
    return {
      message: "You need authorization to create a post.",
    };
  }

  try {
    const createdPost = await prisma.post.create({
      data: {
        title: finalPost.title,
        content: finalPost.content,
        category: finalPost.category,
        description: finalPost.description,
        state: finalPost.state,
        coverImage: finalPost.coverImage,
        // Assuming you have a relation from Post to User
        authorId: user.id,
      },
    });

    // Revalidate the path to show the new post immediately
    revalidatePath(`/blog/${createdPost.id}`);
    return {
      message: "Post created successfully!",
      data: createdPost,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      error: "Failed to create post. Please try again.",
    };
  }
}
