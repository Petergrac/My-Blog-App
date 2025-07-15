import { NavLink } from "react-router-dom";
import "../styles/App.css";
import { useMediaQuery } from "react-responsive";

function Home() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <div className="home-div">
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
        <input
          type="text"
          placeholder="Search..."
          className={isMobile ? "hidden" : "input flex-1/4"}
        />
        <div
          className={
            isMobile ? "flex justify-around" : "flex-1/3 justify-around flex"
          }
        >
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/articles">Articles</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>
      </nav>
      <main>
          <div>
              <p>Post any article by becoming an author.</p>
              <p>Get the chance to share your live experience to thousands of users.</p>
              <p>Find most controversial topics related to medicine, engineering and programming.</p>
          </div>
      </main>
    </div>
  );
}
export default Home;
