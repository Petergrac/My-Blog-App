import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

import gsap from "gsap";

gsap.registerPlugin(SplitText);

function HomeComponent() {
  // Responsiveness
  const isMobile = useMediaQuery({ maxWidth: 760 });
  // Animation
  useGSAP(() => {
    const split = new SplitText('.head',{type: 'lines'});
    const tl = gsap.timeline();
    tl.from(split.lines,{
        opacity: 0,
        x: -200,
        stagger: 0.1,
        duration: 0.3,
        ease: 'power2.out'
    }).from('.component_image',{
        y: +800,
        duration: 1,
        ease: 'power2.out',
        stagger: .1
    })
  },[]);
  return (
    <div className={isMobile ? 'text-blue-100': 'text-blue-100 flex min-h-[95vh] flex-wrap'}>
      <div className={isMobile ? "flex flex-col  px-5 py-5" : "article "}>
        <div>
          <h2 className="text-2xl head font-bold mb-2">
            Explore Knowledge from Every Corner of Life
          </h2>
          <h3 className="text-lg head  font-bold text-blue-300">
            📚 Over 5,000+ Articles and Growing!{" "}
          </h3>
          <p className="head">
            From everyday tech tips to groundbreaking scientific discoveries,
            our blog is a gateway to deep insights and practical knowledge.
          </p>
        </div>
        <img
          className="component_image"
          src="/laptop.jpg"
          alt="workspace-with-laptop"
          loading="lazy"
        />
      </div>
      <div className={isMobile ? "flex flex-col px-5 py-5" : "article"}>
        <div>
          <h2 className="text-2xl font-bold mb-2 head">
            🧑‍💻 Technology & Engineering
          </h2>
          <p className="head">
            Dive into software engineering, DevOps, AI, cybersecurity, and
            electrical engineering.
          </p>
          <p className="head">
            Real-world projects and industry trends shared by engineers and
            developers.
          </p>
        </div>
        <img
          className="component_image"
          src="/engineer.jpg"
          alt="engineer-image"
          loading="lazy"
        />
      </div>
      <div className={isMobile ? "flex flex-col px-5 py-5" : "article"}>
        <div>
          <h2 className="text-2xl font-bold mb-2 head">🧪 Science & Innovation</h2>
          <p className="head">
            Discover how physics, chemistry, biology, and space science evolve
            our world.
          </p>
          <p className="head">Peer-reviewed style posts and easy-to-understand breakdowns.</p>
        </div>
        <img
          className="component_image"
          src="/marine.jpg"
          alt="marine-image"
          loading="lazy"
        />
      </div>
    </div>
  );
}
export default HomeComponent;
