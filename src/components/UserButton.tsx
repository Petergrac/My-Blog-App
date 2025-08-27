"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomUserButton() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserButton userProfileUrl="/user-profile" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* The standard user button profile link */}
        <DropdownMenuItem onClick={() => router.push("/user-profile")}>
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Your custom link to the change role page */}
        <DropdownMenuItem onClick={() => router.push("/settings/change-role")}>
          Change Role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Clerk's sign-out button */}
        <DropdownMenuItem onClick={() => router.push("/sign-out")}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}