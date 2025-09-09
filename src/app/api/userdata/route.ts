import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId")!;
  try {
    const userData = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        country: true,
        bio: true,
        id: true,
      },
    });
    return Response.json(userData);
  } catch (error) {
    throw error;
  }
}
