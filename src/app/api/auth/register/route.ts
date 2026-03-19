import { z } from "zod";
import { hash } from "bcryptjs";

import { directPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const registerSchema = z.object({
  email: z.email(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(24, "Username must be 24 characters or less.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only use letters, numbers, and _."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message = fieldErrors.password?.[0] ?? "Invalid input.";

    return Response.json({ error: message }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const username = parsed.data.username.toLowerCase().trim();

  const existingUser = await directPrisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: { email: true, username: true },
  });

  if (existingUser?.email === email) {
    return Response.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  if (existingUser?.username === username) {
    return Response.json(
      { error: "That username is already taken." },
      { status: 409 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 10);

  await directPrisma.user.create({
    data: {
      email,
      username,
      name: username,
      passwordHash,
      role: "User",
      onboardingComplete: false,
    },
  });

  return Response.json({ ok: true });
}
