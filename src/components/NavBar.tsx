import { ModeToggle } from "./ModeToggle";
import UserAvatar from "./UserAvatar";
const NavBar = () => {
  return (
    <nav className="flex w-full justify-between gap-10 py-2 pl-10 pr-4 pb-4">
      <div>
        <h1 className="text-sm md:font-medium text-cyan-500">
          Blog Dashboard
        </h1>
        <p className="text-xs text-muted-foreground">
          by<span className="text-rose-400 text-sm"> Peter Jones</span>
        </p>
      </div>
      <div className="flex gap-4 items-center">
        <ModeToggle />
        <UserAvatar />
        <p className="hidden md:block text-sm font-medium text-muted-foreground">
          John Doe
        </p>
      </div>
    </nav>
  );
};

export default NavBar;
