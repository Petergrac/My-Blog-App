import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string | null;
      avatar: string | null;
      firstName: string | null;
      lastName: string | null;
      onboardingComplete: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    username: string | null;
    avatar: string | null;
    firstName: string | null;
    lastName: string | null;
    onboardingComplete: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    username?: string | null;
    avatar?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    onboardingComplete?: boolean;
  }
}
