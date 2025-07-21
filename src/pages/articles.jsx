import { lazy } from "react";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { getAllPosts } from "../RESTapi/api";
import gsap from "gsap";
import PostCard from "../components/postCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
const Navbar = lazy(() => import("../components/dashNavBar"));
const Footer = lazy(() => import("../components/footer"));

function Articles() {
  const cardRef = useRef(null);
  // Animation
  useGSAP(() => {
    gsap.from(cardRef.current, {
      opacity: 1,
      y: -400,
      duration: 1,
      ease: "power2.out",
      stagger: {
        from: "start",
        axis: "y",
        duration: 1,
      },
    });
  }, []);
  // Data fetching
  const { data, error, isLoading } = useQuery({
    queryKey: ["Posts"],
    queryFn: () => getAllPosts(),
  });
  if (isLoading) {
    return <Loading />;
  }
  if (!data.length > 0) {
    return (
      <div>
        <Navbar />
        <div className="error-page text-white/75">No Published Articles.</div> <Footer />
      </div>
    );
  }
  if (error) {
    return <div>Error occurred and could not load data</div>;
  }
  return (
    <div className="bg-slate-700 md:min-h-[100vh] md:mb-0 mb-10">
      <Navbar />
      <h1 className="text-3xl sticky top-0 z-40 backdrop-blur-xs text-white gothic text-center md:py-5 text-bold py-5">
        All Articles
      </h1>
      <div ref={cardRef} className="flex flex-wrap gap-2 md:m-10 m-4">
        {data.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Articles;
