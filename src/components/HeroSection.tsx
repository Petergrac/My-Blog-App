"use client";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

const HeroSection = () => {
  const path = usePathname();
  let image: string | null = null;
  switch (path) {
    case "/":
      image = "home";
      break;
    case "/contact":
      image = "contacts";
      break;
    case "/about":
      image = "about";
      break;
    case "/categories":
      image = "categories";
      break;
    default:
      image = "home";
      break;
  }
  return (
    <div
      className=""
      style={{
        backgroundImage: `url(./hero/${image}.jpg)`,
        backgroundSize: "cover",
        height: "30vh",
      }}
    >
      <NavBar />
      {path === "/" ? (
        <div className="flex flex-col items-center text-gray-200">
          <h1 className="font-playfair text-2xl md:text-5xl">
            Lets do it together.
          </h1>
          <p className="font-lora text-sm">
            We share a lot of technology blogs.Come along for the ride
          </p>
        </div>
      ) : path === "/contact" ? (
        <div className="flex font-lora items-center justify-center mt-10 text-4xl text-gray-200">
          Lets connect
        </div>
      ) : path === "/about" ? (
        <div className="flex font-lora items-center justify-center mt-10 text-4xl text-gray-200">
          We love writing
        </div>
      ) : (
        path === "/categories" && (
          <div className="flex font-lora items-center justify-center mt-10 text-4xl text-gray-200">
            Categories
          </div>
        )
      )}
    </div>
  );
};

export default HeroSection;
