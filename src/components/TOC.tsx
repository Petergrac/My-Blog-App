// components/ActiveToc.tsx
"use client";

import React, { useEffect, useRef } from 'react';

interface TocItem {
  id: string;
  level: number;
  text: string;
}

interface ActiveTocProps {
  toc: TocItem[];
}

const ActiveToc: React.FC<ActiveTocProps> = ({ toc }) => {
  const headingsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Get all heading elements on the page
    headingsRef.current = Array.from(document.querySelectorAll('h1[id], h2[id], h3[id]'));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          if (id) {
            const tocLink = document.querySelector(`a[href="#${id}"]`);
            if (tocLink) {
              if (entry.isIntersecting) {
                tocLink.classList.add('active'); // Add active class
              } else {
                tocLink.classList.remove('active'); // Remove active class
              }
            }
          }
        });
      },
      {
        rootMargin: '0px 0px -50% 0px', // Adjust this to fine-tune when the link becomes active
        threshold: 0,
      }
    );

    // Observe each heading
    headingsRef.current.forEach(heading => observer.observe(heading));

    return () => {
      // Clean up observer on component unmount
      headingsRef.current.forEach(heading => observer.unobserve(heading));
    };
  }, [toc]);

  return (
    <nav className="w-1/4 p-4 border-r hidden md:block sticky top-0 z-50 overflow-y-auto h-screen">
      <h3 className="font-bold mb-2">Table of Contents</h3>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id} className={`toc-level-${item.level}`}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ActiveToc;