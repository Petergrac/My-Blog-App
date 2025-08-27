"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

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
    return { message: "Role Updated"};
  } catch (err) {
    console.log(err);
    return { error: "There was error when updating the role" };
  }
};
export default changeRole;
