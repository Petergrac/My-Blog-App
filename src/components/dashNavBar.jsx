import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import "../styles/App.css";

function DashNavBar() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <nav className="nav">
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
        <NavLink to="/">Home</NavLink>
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </nav>
  );
}
export default DashNavBar;
