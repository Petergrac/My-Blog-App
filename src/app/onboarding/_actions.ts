"use server";

import { auth } from "@/auth";
import { directPrisma } from "@/lib/prisma";

export const completeOnboarding = async (formData: FormData) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const role = (formData.get("membershipType") as string) || "User";

  try {
    const res = await directPrisma.user.update({
      where: { id: userId },
      data: {
        onboardingComplete: true,
        role,
      },
      select: {
        role: true,
        onboardingComplete: true,
      },
    });
    return { message: res };
  } catch (err: unknown) {
    console.log(err);
    return { error: "There was an error updating the user metadata." };
  }
};
