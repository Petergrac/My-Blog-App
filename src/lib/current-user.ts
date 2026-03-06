import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

const databaseUserSelect = {
  id: true,
  clerkId: true,
  username: true,
  email: true,
  avatar: true,
  bio: true,
  country: true,
  createdAt: true,
} as const;

export async function getCurrentDatabaseUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: databaseUserSelect,
  });

  if (existingUser) {
    return existingUser;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unable to load the current Clerk user.");
  }

  return prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      avatar: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      username: clerkUser.username ?? clerkUser.firstName ?? "User",
    },
    create: {
      avatar: clerkUser.imageUrl,
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      username: clerkUser.username ?? clerkUser.firstName ?? "User",
    },
    select: databaseUserSelect,
  });
}

export async function requireCurrentDatabaseUser() {
  const currentUser = await getCurrentDatabaseUser();

  if (!currentUser) {
    await auth.protect();
    throw new Error("Unauthorized");
  }

  return currentUser;
}
