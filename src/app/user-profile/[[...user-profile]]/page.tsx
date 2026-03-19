"use client";

import Link from "next/link";
import { ArrowLeft, Mail, UserCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

import Bio from "@/components/user/UserBio";
import UserAccountForm from "@/components/user/UserAccountForm";
import UserRole from "@/components/user/UserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserProfilePage = () => {
  const { data: session } = useSession();
  const displayName =
    [session?.user?.firstName, session?.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    session?.user?.username ||
    session?.user?.name ||
    "Bloog member";

  return (
    <div className="flex flex-col flex-1 justify-center items-center min-h-screen px-4 py-10">
      <Link
        href="/"
        className="text-sm flex gap-2 items-center py-5 hover:underline anim"
      >
        <ArrowLeft />
        Back to Homepage
      </Link>

      <div className="w-full max-w-5xl space-y-6">
        <Card className="border-border/70 bg-card/95 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/30">
              <UserCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">Account overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                {displayName}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            {session?.user?.email ? (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {session.user.email}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <UserAccountForm />
          <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
            <UserRole />
            <Bio />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
