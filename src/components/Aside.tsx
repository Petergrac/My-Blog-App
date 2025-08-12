"use client"
import toc from "./config/GenerateTOC";
import { useEffect, useState } from "react";
const Aside = () => {

    const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px", // triggers when heading is near middle
        threshold: 0,
      }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [toc]);
  console.log(toc);
  return (
    <aside className=" my-10 border-l-2 px-4 z-100">
      <h1 className="text-base font-bold mb-2">
        On this Page
      </h1>
      <ul className="flex gap-2 flex-col">
        {toc.map((heading) => (
          <a href={`#${heading.id}`} className={`block hover:underline ${
                activeId === heading.id ? "text-blue-600 font-bold" : ""
              }`} key={heading.id + heading.text}>
            {heading.text}
          </a>
        ))}
      </ul>
    </aside>
  );
};

export default Aside;
