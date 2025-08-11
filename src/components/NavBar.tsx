import { ModeToggle } from "./ModeToggle";
import UserAvatar from './UserAvatar';
const NavBar = () => {
  return (
      <nav className="flex w-full justify-end gap-10 py-2 px-4 border-b-1 pb-4">
          <div className="flex gap-4 items-center">
              <ModeToggle />
              <UserAvatar />
              <p className="hidden md:block text-sm font-medium text-muted-foreground">John Doe</p>
          </div>
      </nav>
  );
};

export default NavBar;
