"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "./prisma";

// Update user metadata
const changeRole = async (role: string) => {
  const { userId } = await auth();
  const client = await clerkClient();
  if (!userId) {
    return { error: "You must be logged in." };
  }

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });
    return { message: "Role Updated" };
  } catch (err) {
    console.log(err);
    return { error: "There was error when updating the role" };
  }
};
export default changeRole;

// ADD BIO & COUNTRY IN THE DATABASE
export const saveUserData = async ({
  bio,
  country,
}: {
  bio: string;
  country: string;
}) => {
  const { userId } = await auth();
  // Check for user in clerk
  if (!userId) return { error: "This user is not available on the database" };
  // Add data to the database
  try {
    if (country.trim().length > 2) {
      await prisma.user.update({
        where: {
          clerkId: userId,
        },
        data: {
          country,
        },
      });
      return { message: "Country field updated!" };
    }
    if (bio.trim().length > 5) {
      await prisma.user.update({
        where: {
          clerkId: userId,
        },
        data: {
          bio,
        },
      });
      return { message: "Bio field updated!" };
    }
  } catch (err) {
    console.log(err);
    return { error: "Could not update the user" };
  }
};
