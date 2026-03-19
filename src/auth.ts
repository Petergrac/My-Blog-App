import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { z } from "zod";
import { directPrisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

const isDev = process.env.NODE_ENV !== "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(directPrisma),
  session: { strategy: "jwt" },
  debug: isDev,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          if (isDev)
            console.warn("[auth] Credentials signin failed: missing fields.");
          return null;
        }

        const identifier = parsed.data.email.toLowerCase().trim();
        let user;
        try {
          user = await directPrisma.user.findFirst({
            where: {
              OR: [{ email: identifier }, { username: identifier }],
            },
          });
        } catch (error) {
          if (isDev)
            console.error("[auth] Credentials signin failed: DB error.", error);
          return null;
        }

        if (!user || !user.passwordHash) {
          if (isDev)
            console.warn(
              "[auth] Credentials signin failed: user missing or no password hash.",
            );
          return null;
        }

        const isValid = await compare(parsed.data.password, user.passwordHash);
        if (!isValid) {
          if (isDev)
            console.warn("[auth] Credentials signin failed: bad password.");
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        const dbUser = await directPrisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            role: true,
            username: true,
            avatar: true,
            onboardingComplete: true,
            firstName: true,
            lastName: true,
          },
        });

        token.id = user.id;
        token.role = dbUser?.role ?? "User";
        token.username = dbUser?.username ?? null;
        token.avatar = dbUser?.avatar ?? null;
        token.onboardingComplete = dbUser?.onboardingComplete ?? false;
        token.firstName = dbUser?.firstName ?? null;
        token.lastName = dbUser?.lastName ?? null;
      }

      // update() call — use passed data if available, otherwise fetch from DB
      if (trigger === "update" && token.sub) {
        if (session?.user) {
          // Data was passed directly — use it, no DB call needed
          token.onboardingComplete =
            session.user.onboardingComplete ??
            token.onboardingComplete ??
            false;
          token.role = session.user.role ?? token.role ?? "User";
          token.username = session.user.username ?? token.username ?? null;
          token.avatar = session.user.avatar ?? token.avatar ?? null;
          token.firstName = session.user.firstName ?? token.firstName ?? null;
          token.lastName = session.user.lastName ?? token.lastName ?? null;
        } else {
          // No data passed — fetch from DB
          const refreshed = await directPrisma.user.findUnique({
            where: { id: token.sub },
            select: {
              role: true,
              username: true,
              avatar: true,
              onboardingComplete: true,
              firstName: true,
              lastName: true,
            },
          });

          if (refreshed) {
            token.role = refreshed.role ?? token.role ?? "User";
            token.username = refreshed.username ?? null;
            token.avatar = refreshed.avatar ?? null;
            token.onboardingComplete = refreshed.onboardingComplete ?? false;
            token.firstName = refreshed.firstName ?? null;
            token.lastName = refreshed.lastName ?? null;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          (token.sub as string | undefined) ??
          (token.id as string | undefined) ??
          "";
        session.user.role = (token.role as string | undefined) ?? "User";
        session.user.username = (token.username as string | null) ?? null;
        session.user.avatar = (token.avatar as string | null) ?? null;
        session.user.onboardingComplete =
          (token.onboardingComplete as boolean | undefined) ?? false;
        session.user.firstName = (token.firstName as string | null) ?? null;
        session.user.lastName = (token.lastName as string | null) ?? null;
      }
      return session;
    },
  },
});
