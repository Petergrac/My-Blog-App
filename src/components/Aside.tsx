"use client";
import toc from "./config/Generator";
import { useEffect, useState } from "react";
const Aside = () => {
  const [activeId, setActiveId] = useState<string>("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      // Callback function
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      // Options
      {
        root: null,
        threshold: 0,
      }
    );
    // Find the element in the table of content
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    // Cleanup function
    return () => {
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <aside className=" my-10 border-l-2 px-4 z-100">
      <h1 className="text-base font-bold mb-2">On this Page</h1>
      <ul className="flex gap-2 flex-col">
        {toc.map((heading) => (
          <a
            href={`#${heading.id}`}
            className={`block hover:underline ${
              activeId === heading.id ? "text-blue-600 font-bold" : ""
            }`}
            key={heading.id + heading.text}
          >
            {heading.text}
          </a>
        ))}
      </ul>
    </aside>
  );
};

export default Aside;
