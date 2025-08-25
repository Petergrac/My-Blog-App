import FeaturedPost from "@/components/FeaturedPost";
import MostRecent from "@/components/MostRecent";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* CATEGORIES */}
     <div className="flex flex-wrap gap-2 gap-y-5 pt-1 justify-center border-b-[1px] pb-3 md:pb-5">
      <Link className="text-xs font-lora p-2 hover:bg-foreground/55" href="/categories/frontend">FRONTEND</Link>
      <Link className="text-xs font-lora p-2 hover:bg-foreground/55" href="/categories/backend">BACKEND</Link>
      <Link className="text-xs font-lora p-2 hover:bg-foreground/55" href="/categories/devops">DEVOPS</Link>
      <Link className="text-xs font-lora p-2 hover:bg-foreground/55" href="/categories/data-structures">DATA STRUCTURES</Link>
      <Link className="text-xs font-lora p-2 hover:bg-foreground/55" href="/categories/data-science">DATA SCIENCE</Link>
      <Link className="text-xs font-lora p-2 hover:bg-foreground/55" href="/categories/testing">TESTING</Link>
      <Link className="text-xs font-lora p-2 hover:bg-foreground/55" href="/categories/system-design">SYSTEM DESIGN</Link>
     </div>
     {/* FEATURED */}
     <div className="mt-10 mb-5">
       <p className="text-center text-lg pb-5 underline underline-offset-5">Featured Posts</p>
       <div className="flex flex-wrap flex-1 gap-2">
         <FeaturedPost />
         <FeaturedPost />
         <FeaturedPost />
         <FeaturedPost />
       </div>
     </div>
     {/* RECENT POSTS*/}
     <div className="mt-5 mb-10">
      <p className="text-lg text-center underline underline-offset-5">Most Recent</p>
      <div className="flex flex-wrap gap-2 gap-y-5 mt-5">
        <MostRecent />
        <MostRecent />
        <MostRecent />
        <MostRecent />
        <MostRecent />
        <MostRecent />
        <MostRecent />
      </div>
     </div>
    </div>
  );
}
