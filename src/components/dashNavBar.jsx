import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import "../styles/App.css";

function DashNavBar() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <nav className="nav sticky top-0 z-70">
      <h1
        className={
          isMobile
            ? "text-center header michroma mb-1"
            : "flex flex-1/4 michroma header pl-10"
        }
      >
        Dashboard
      </h1>
      <div
        className={
          isMobile ? "flex justify-around" : "flex-1/3 justify-around flex"
        }
      >
        <NavLink className='nav-links' to="/">Home</NavLink>
        <NavLink className='nav-links' to="/articles">Articles</NavLink>
        <NavLink className='nav-links' to="/profile">Profile</NavLink>
      </div>
    </nav>
  );
}
export default DashNavBar;
