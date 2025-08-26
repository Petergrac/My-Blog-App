"use client";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Image from "next/image";

const HeroSection = () => {
  const path = usePathname();

  let image;
  let description;
  let shortDesc: string | undefined = undefined;

  const hero: {
    path: string;
    image: string;
    description?: string;
    shortDesc: string;
  }[] = [
    {
      path: "/",
      shortDesc: "Explore the newest posts here.",
      description:
        "Welcome! We offer a full-featured editor with complete customization, allowing you to easily create and publish your work.",
      image: "/hero/home.jpg",
    },
    {
      path: "/about",
      shortDesc: "Learn about our journey",
      description:
        "Discover the story behind our platform and meet the team that's passionate about writing and creativity",
      image: "/hero/about.jpg",
    },
    {
      path: "/contact",
      shortDesc: "Get in touch with us",
      description:
        "Have a question or a comment? Reach out to us through our contact page. We'd love to hear from you!",
      image: "/hero/contact.jpg",
    },
    {
      path: "/categories",
      shortDesc: "Browse by topic",
      description:
        "Easily explore and filter our extensive collection of posts by category, from technology to lifestyle and more.",
      image: "/hero/categories.jpg",
    },
    {
      path: "/new",
      shortDesc: "Start creating your own content.",
      description:
        "Use our powerful and rich editor to easily create and publish any type of blog post, from articles to photo essays.",
      image: "/hero/tiptap.jpg",
    },
    {
      path: `/blog/*`,
      shortDesc: "Dive into a single post",
      description:
        "Experience the full content of a blog post, complete with rich media, interactive elements, and detailed information.",
      image: "/hero/blog.jpg",
    },
  ];
  // Check for the path and style
  hero.forEach((route) => {
    if (
      (route.path === "/blog/*" && path.startsWith("/blog/")) ||
      path === route.path
    ) {
      image = route.image;
      shortDesc = route.shortDesc;
      if (route.description) {
        description = route.description;
      }
    }
  });
  return (
    <div className="relative aspect-video  w-full min-h-[40vh] max-h-[60vh]">
      {image && <Image src={image} alt="" fill />}
      <NavBar />
      <div className="w-full h-full flex flex-col items-center justify-center absolute top-1/2 bg-black/75 left-1/2 -translate-1/2">
        <h1 className="text-center text-2xl sm:text-4xl md:text-6xl text-gray-200">
          {shortDesc}
        </h1>
        <p className="text-center text-sm md:text-base w-1/2 text-gray-200">
          {description}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
