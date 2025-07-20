import { Link } from "react-router-dom";
import {  useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function NotFound() {
  const ref = useRef();

  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });
  }, []);

  return (
    <div ref={ref} className="min-h-screen bg-slate-800 text-white flex flex-col items-center justify-center px-4" >
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
