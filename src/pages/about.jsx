import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Footer from "../components/postFooter";

function About() {
  const sectionRef = useRef();

  useGSAP(() => {
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: "power2.out",
    });
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-slate-800 text-white flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl text-center space-y-6" ref={sectionRef}>
          <h1 className="text-4xl font-bold">About LinuxLabs</h1>
          <p className="text-lg text-slate-300">
            LinuxLabs is a developer-focused initiative to educate and inspire innovation through open source, clean architecture, and practical software engineering skills.
          </p>
          <p className="text-slate-400">
            Whether you're just starting out or pushing production-ready systems, LinuxLabs is built to support your growth through articles, tools, and community.
          </p>
        </div>
      </div>
        <Footer />
    </div>
  );
}

export default About;
