import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../components/footer";

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const el = containerRef.current;

    gsap.from(el.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-800 text-white px-4 py-16 md:px-20">
      <div className="max-w-3xl mx-auto mb-16" ref={containerRef}>
        <h1 className="text-4xl font-bold mb-6 text-center">
          Contact LinuxLabs
        </h1>
        <p className="text-lg mb-10 text-center text-slate-300">
          Let's build something awesome together. Reach out below!
        </p>

        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-200">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-200">
              Message
            </label>
            <textarea
              rows="5"
              className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
