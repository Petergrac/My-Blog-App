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
  id,
}: {
  bio: string;
  country: string;
  id: string | "";
}) => {
  const { userId } = await auth();
  // Check for user in clerk
  if (!userId) return { error: "This user is not available on the database" };
  // Add data to the database
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        country,
        bio,
      },
    });
    return {message: "User data updated successfully!"}
  } catch (err) {
    console.log(err);
    return { error: "Could not update the user" };
  }
};
