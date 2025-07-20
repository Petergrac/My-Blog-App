import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Footer from "../components/postFooter";

function ProfilePage() {
  useGSAP(() => {
    gsap.from(".profile-section", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-800 text-white px-4 py-10 md:px-16">
      <div className="max-w-4xl mx-auto mb-8 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center profile-section">
          My simple Bio
        </h1>

        <div className="bg-slate-700 rounded-2xl p-6 md:p-8 shadow-lg profile-section">
              <h2 className="text-2xl font-semibold mb-1">Peter LinuxLabs</h2>
              <p className="text-blue-300">Software Engineer @ LinuxLabs</p>
              <p className="mt-2 text-slate-300">
                Passionate about open-source, web development, and breaking down
                complex tech into simple knowledge.
              </p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700 p-6 rounded-2xl shadow-md profile-section">
            <h3 className="text-xl font-bold mb-2">Contact Info</h3>
            <ul className="text-slate-300 space-y-1">
              <li>Email: peterjones@gmail.com</li>
              <li>Phone: +2547 08 711 338</li>
              <li>Location: Nairobi 🌍</li>
            </ul>
          </div>

          <div className="bg-slate-700 p-6 rounded-2xl shadow-md profile-section">
            <h3 className="text-xl font-bold mb-2">Skills</h3>
            <ul className="text-slate-300 space-y-1">
              <li>JavaScript, C++, Python, Java</li>
              <li>React, Node.js, Express, PostgreSQL</li>
              <li>Linux, Web Security, Webpack</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
