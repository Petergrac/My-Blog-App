import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
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
