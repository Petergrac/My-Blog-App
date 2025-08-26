import StaticRenderer from "@/components/StaticRenderer";
import content from "@/components/tiptap-templates/simple/data/content";
import Image from "next/image";

const PostPage = () => {
  return (
    <div className="py-10 mx-auto md:max-w-[90vw] lg:max-w-[70vw]">
      {/* TITLE */}
      <div className="pb-5 border-b-[1px] shadow-md">
        <h1 className="sm:text-4xl underline underline-offset-4 text-2xl text-center">
          From Top Down
        </h1>
        <div className="flex mx-auto w-fit gap-10 py-4  justify-center">
          <p className="text-sm text-center">September 25, 2025</p>
          <p className="text-sm bg-fuchsia-600 rounded-sm p-[1px] text-white w-fit text-center">
            DATA SCIENCE
          </p>
        </div>
      </div>
      {/* CONTENT */}
      <StaticRenderer content={content} />
      {/* ABOUT THE AUTHOR */}
      <div className="border-t-3 py-4">
        {/* AVATAR */}
        <Image
          src="/hero/home.jpg"
          alt=""
          width={100}
          height={100}
          className="aspect-square overflow-hidden rounded-full mx-auto"
        />
        <p className="text-sm text-center py-3  font-sans font-bold">
          William Wong
        </p>
        <p className="text-center font-light tracking-tighter text-xs w-72 mx-auto">
          My name is Will and I first discovered Webflow in November 2013. Since
          then, Webflow has had a HUGE impact on my web design projects – saving
          me countless design hours, development costs, and has helped improve
          my understanding of HTML/CSS tremendously!
        </p>
      </div>
    </div>
  );
};
export default PostPage;

// Pre Render the page using SSG
// export async function getStaticParams()
