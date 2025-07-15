import { posts } from "../constants/test";
import PostCard from "../components/posts";

function Articles() {
  return (
    <div className="bg-slate-900">
        <h1 className="text-3xl text-white ">All Articles</h1>
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  );
}

export default Articles;
