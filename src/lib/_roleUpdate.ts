"use server";
import { auth } from "@/auth";
import { directPrisma } from "./prisma";
import { revalidatePath } from "next/cache";

export const changeRole = async (role: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "You must be logged in." };

  try {
    await directPrisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/", "layout");
    return { message: "Role Updated" };
  } catch (err) {
    console.log(err);
    return { error: "There was error when updating the role" };
  }
};

export const saveUserData = async ({
  bio,
  country,
}: {
  bio: string;
  country: string;
}) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "This user is not available on the database" };

  try {
    await directPrisma.user.update({
      where: { id: userId },
      data: { country, bio },
    });
    revalidatePath("/", "layout");
    return { message: "User data updated successfully!" };
  } catch (err) {
    console.log(err);
    return { error: "Could not update the user" };
  }
};

const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const updateAccountDetails = async ({
  username,
  firstName,
  lastName,
}: {
  username: string;
  firstName: string;
  lastName: string;
}) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "You must be logged in." };

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedFirst = firstName.trim();
  const normalizedLast = lastName.trim();

  if (!normalizedUsername) return { error: "Username is required." };

  if (
    normalizedUsername.length < 3 ||
    normalizedUsername.length > 24 ||
    !usernameRegex.test(normalizedUsername)
  ) {
    return {
      error:
        "Username must be 3-24 characters and use letters, numbers, and underscores.",
    };
  }

  const existingUser = await directPrisma.user.findFirst({
    where: { username: normalizedUsername, id: { not: userId } },
    select: { id: true },
  });

  if (existingUser) return { error: "That username is already taken." };

  const displayName = [normalizedFirst, normalizedLast]
    .filter(Boolean)
    .join(" ")
    .trim();

  try {
    await directPrisma.user.update({
      where: { id: userId },
      data: {
        username: normalizedUsername,
        firstName: normalizedFirst || null,
        lastName: normalizedLast || null,
        name: displayName || normalizedUsername,
      },
    });
    revalidatePath("/", "layout");
    return { message: "Account updated successfully!" };
  } catch (err) {
    console.log(err);
    return { error: "Could not update the account." };
  }
};
