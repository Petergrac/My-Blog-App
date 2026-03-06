"use server";
import prisma from "@/lib/prisma";
import { requireCurrentDatabaseUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

async function requireCurrentUser() {
  return requireCurrentDatabaseUser();
}

export async function createComment(postId: string, content: string) {
  try {
    const currentUser = await requireCurrentUser();

    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: currentUser.id,
      },
    });
    revalidatePath(`/blog/${postId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function patchComment(
  commentId: string,
  postId: string,
  content: string
) {
  try {
    const currentUser = await requireCurrentUser();
    const currentComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        authorId: true,
      },
    });

    if (!currentComment) {
      throw new Error("Comment not found.");
    }

    if (currentComment.authorId !== currentUser.id) {
      throw new Error("You can only edit your own comments.");
    }

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content,
      },
    });
    revalidatePath(`/blog/${postId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteComment(commentId: string, postId: string) {
  try {
    const currentUser = await requireCurrentUser();
    const currentComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        authorId: true,
      },
    });

    if (!currentComment) {
      throw new Error("Comment not found.");
    }

    if (currentComment.authorId !== currentUser.id) {
      throw new Error("You can only delete your own comments.");
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    revalidatePath(`/blog/${postId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
