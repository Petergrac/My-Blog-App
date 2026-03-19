"use client";

import { Menu, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CustomUserButton from "@/components/user/UserButton";

import ProgressiveSearch from "@/components/layout/SearchBar";
import { ModeToggle } from "@/components/layout/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Use a dedicated sign-in page instead of a modal overlay.

const NavBar = ({ isTrue }: { isTrue: boolean }) => {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const role = session?.user?.role as string | undefined;

  return (
    <nav
      className={`bg-linear-to-b from-black pb-5 pt-3 flex ${
        isTrue && "absolute"
      } items-center justify-between md:justify-around w-full z-20 px-5`}
    >
      <Link href="/" className="text-2xl line-clamp-3 font-sans font-bold">
        <span className="text-sky-500">Blo</span>
        <span className="text-yellow-300">og</span>
      </Link>

      <Dialog>
        <DialogTrigger>
          <SearchIcon className="text-white" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="sr-only">Search any post</DialogTitle>
          <DialogDescription>
            Search by Author Name, Category...
          </DialogDescription>
          <ProgressiveSearch />
        </DialogContent>
      </Dialog>

      {/* DESKTOP */}
      <div className="hidden md:flex gap-20 justify-between items-center">
        <div className="flex gap-3 text-gray-200 text-sm">
          <Link href="/">HOME</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACTS</Link>
          {(role === "Author" || role === "Admin") && (
            <Link href="/new">NEW POST</Link>
          )}
          {(role === "Author" || role === "Admin") && (
            <Link href="/blog/my-blogs">MY POSTS</Link>
          )}
        </div>

        <div className="flex sm-2 md:gap-5 items-center">
          <ModeToggle />
          {isSignedIn ? (
            <CustomUserButton />
          ) : (
            // Redirect to the custom /sign-in page instead of opening a modal.
            <Link
              href="/sign-in"
              className="bg-white text-black text-sm px-3 py-1 font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE */}
      <div className="flex gap-2 items-center md:hidden">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center text-white font-bold outline-none">
            MENU
            <Menu className="text-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col justify-around items-center">
            <DropdownMenuItem>
              <Link href="/">HOME</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/contact">CONTACTS</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/about">ABOUT</Link>
            </DropdownMenuItem>
            {(role === "Author" || role === "Admin") && (
              <DropdownMenuItem>
                <Link href="/new">NEW POST</Link>
              </DropdownMenuItem>
            )}
            {(role === "Author" || role === "Admin") && (
              <DropdownMenuItem>
                <Link href="/blog/my-blogs">MY POSTS</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {isSignedIn ? (
          <CustomUserButton />
        ) : (
          // Mobile sign-in link
          <Link
            href="/sign-in"
            className="bg-white text-black text-sm px-3 py-1 font-semibold rounded-sm hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
