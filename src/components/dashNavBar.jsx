import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import { LoaderIcon, Search } from "lucide-react";
import { useState } from "react";
import "../styles/App.css";
import { useQuery } from "@tanstack/react-query";
import { search } from "../RESTapi/api";
import useDebounce from "../hooks/customHooks";

function DashNavBar() {
  const [toggleClick, setToggleClick] = useState(false);
  const [query, setQuery] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const handleSearchClick = () => setToggleClick((prev) => !prev);
  const handleBlur = () => isMobile && setToggleClick(false);
  const showInput = (isMobile && toggleClick) || (!isMobile && !toggleClick);
  const debouncedValue = useDebounce(query, 500);
  // Handle search
  const { data: results} = useQuery({
    queryKey: ["Search", debouncedValue],
    queryFn: () => search(query),
    enabled: !!debouncedValue,
  });

  return (
    <nav className="nav sticky top-0 z-70">
      <h1
        className={`header michroma mb-1 ${
          isMobile ? "text-center" : "flex flex-1/8 pl-10"
        }`}
      >
        Dashboard
      </h1>

      <div
        className={`flex items-center ${
          isMobile ? "justify-around" : "justify-around flex-7/8"
        }`}
      >
        {showInput && (
          <div className="relative">
            <input
              type="text"
              className="input w-full md:w-auto"
              placeholder="Search title, content . . ."
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
            />

            {results
              ? results.length > 0 && (
                  <ul className="absolute bg-slate-800 w-full shadow-md  z-50 max-h-60 overflow-y-auto">
                    {results.map((item) => (
                      <li
                        key={item.id}
                        onBlur={handleBlur}
                        className="p-2 border-b hover:bg-slate-500 cursor-pointer"
                      >
                        <NavLink to={`/post-detail/${item.id}`}>
                          {item.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )
              : ""}
          </div>
        )}

        {!toggleClick && isMobile && (
          <Search size={20} onClick={handleSearchClick} color="gray" />
        )}

        {!toggleClick && (
          <>
            <NavLink className="nav" to="/">
              Home
            </NavLink>
            <NavLink className="nav" to="/articles">
              Articles
            </NavLink>
            <NavLink className="nav" to="/profile">
              Profile
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default DashNavBar;
