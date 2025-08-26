'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        membershipType: formData.get("membershipType"),
        imageUrl: formData.get('imageURl')
      },
    });
    return { message: res.publicMetadata }
  } catch (err: unknown) {
    console.log(err);
    return { error: 'There was an error updating the user metadata.' }
  }
}