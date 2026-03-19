"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomUserButton() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const avatar = session.user.avatar || session.user.image || "/noAvatar.jpeg";
  const fullName = [session.user.firstName, session.user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const displayName =
    fullName ||
    session.user.username ||
    session.user.name ||
    session.user.email ||
    "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2 py-1 text-sm shadow-sm transition hover:bg-accent"
        >
          <span className="relative h-8 w-8 overflow-hidden rounded-full border border-border/70">
            <Image
              alt={displayName}
              fill
              sizes="32px"
              className="object-cover"
              src={avatar}
            />
          </span>
          <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          {session.user.email ? (
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/user-profile">
            <User2 />
            Manage account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
