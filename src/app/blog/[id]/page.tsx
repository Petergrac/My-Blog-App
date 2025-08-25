import StaticRenderer from "@/components/StaticRenderer";
import content from "@/components/tiptap-templates/simple/data/content";
const PostPage = () => {
  return (
    <div>
      {/* TITLE */}
      <div className=""></div>
      {/* CONTENT */}
      <StaticRenderer content={content} />
      {/* STATUS */}
      <div className=""></div>
    </div>
  );
};
export default PostPage;

// Pre Render the page using SSG
// export async function getStaticParams() 
 
