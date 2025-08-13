import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { SidebarTrigger } from "./ui/sidebar";
import { SidebarIcon } from "lucide-react";
const NavBar = async () => {
  const user = await currentUser();
  return (
      <nav className="flex  shadow-2xl sticky top-0 z-400 w-full justify-between py-2 pl-5 pr-4 pb-4">
        <div className="flex gap-2 items-center">
          <SidebarTrigger>
            <SidebarIcon size={20}/>
          </SidebarTrigger>
          <div>
            <h1>
              <span className="text-lg text-sky-600">Bloog </span>
            </h1>
            <p className="text-xs md:font-medium tracking-wider text-indigo-500">
              Explore latest topics in the Tech World
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <SignedOut>
            <SignUpButton>
              <Button className="text-xs">Sign Up</Button>
            </SignUpButton>
            <SignInButton>
              <Button className="text-xs">Log In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex gap-4 items-center">
              {user && user.firstName ? (
                <p className="text-sky-500">
                  {user.firstName?.charAt(0).toUpperCase() +
                    user.firstName?.slice(1).toLowerCase()}
                </p>
              ) : (
                <p>Please sign in</p>
              )}
              <ModeToggle />
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </nav>
  );
};

export default NavBar;
