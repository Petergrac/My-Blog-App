// components/Footer.jsx

import { NavLink } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white/80 w-full px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-blue-400">LinuxLabs</h2>
          <p className="text-sm">Where open-source meets code.</p>
        </div>

        <div className="flex gap-6 text-sm mt-4 md:mt-0">
          <NavLink to="/" className="hover:text-white">
            Home
          </NavLink>
          <NavLink to="/articles" className="hover:text-white">
            Articles
          </NavLink>
          <NavLink to="/about" className="hover:text-white">
            About
          </NavLink>
          <NavLink to="/contact" className="hover:text-white">
            Contact
          </NavLink>
          <NavLink to="/profile" className="hover:text-white">
            Profile
          </NavLink>
        </div>

        <div className="text-sm">
          <p>© {year} LinuxLabs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
