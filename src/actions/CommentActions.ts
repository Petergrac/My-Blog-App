"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(
  userId: string,
  postId: string,
  content: string
) {
  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });
    revalidatePath(`/blog/${postId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function patchComment(commentId: string, content: string) {
  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteComment(commentId: string, postId: string) {
  try {
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
