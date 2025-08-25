import { Menu, Search } from "lucide-react";
import { ModeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-b from-black pb-5 pt-3 flex items-center justify-between md:justify-around flex-1 px-5">
      <h1 className="text-2xl line-clamp-3 font-sans font-bold">
        <span className="text-sky-500">Blo</span>
        <span className="text-yellow-300">og</span>
      </h1>
      <div className="md:flex gap-2 items-center hidden">
        <Search />
        <input
          type="text"
          placeholder="Search"
          className="outline-none bg-transparent py-4"
        />
      </div>
      <div className="hidden md:flex gap-20 justify-between">
        <div className="flex gap-3 text-gray-200 text-sm">
          <Link href="/">HOME</Link>
          <Link href="/categories">CATEGORIES</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACTS</Link>
        </div>
        <ModeToggle />
      </div>
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
            <DropdownMenuItem>
              <Link href="/categories">CATEGORIES</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
