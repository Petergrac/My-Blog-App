import { Menu, SearchIcon } from "lucide-react";
import { ModeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import ProgressiveSearch from "./SearchBar";

const NavBar = ({ isTrue }: { isTrue: boolean }) => {
  return (
    <nav
      className={`bg-gradient-to-b from-black pb-5 pt-3 flex ${
        isTrue && "absolute"
      } items-center justify-between md:justify-around w-full z-20 px-5`}
    >
      <h1 className="text-2xl line-clamp-3 font-sans font-bold">
        <span className="text-sky-500">Blo</span>
        <span className="text-yellow-300">og</span>
      </h1>
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
      <div className="hidden md:flex gap-20 justify-between">
        <div className="flex gap-3 text-gray-200 text-sm">
          <Link href="/">HOME</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACTS</Link>
        </div>
        <div className="flex sm-2 md:gap-5">
          <ModeToggle />
          <SignedIn>
            <UserButton
              userProfileUrl="/user-profile"
              userProfileMode="navigation"
            />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="bg-white text-black text-sm p-1 font-semibold rounded-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
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
          </DropdownMenuContent>
        </DropdownMenu>
        <SignedIn>
          <UserButton
            userProfileUrl="/user-profile"
            userProfileMode="navigation"
          />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="bg-white text-black text-sm p-1 font-semibold rounded-sm">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default NavBar;
