import "server-only";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const databaseUserSelect = {
  id: true,
  username: true,
  email: true,
  avatar: true,
  firstName: true,
  lastName: true,
  bio: true,
  country: true,
  role: true,
  onboardingComplete: true,
  createdAt: true,
} as const;

export async function getCurrentDatabaseUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: databaseUserSelect,
  });
}

export async function requireCurrentDatabaseUser() {
  const currentUser = await getCurrentDatabaseUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return currentUser;
}
