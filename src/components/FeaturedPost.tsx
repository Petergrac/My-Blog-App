import Image from "next/image";
import Link from "next/link";

export interface FeaturedPostType {
  id: string;
  coverImage: string;
  description: string;
  createdAt: Date;
  category: string;
  title: string;
  author: {
    username: string | null;
    avatar: string | null;
  };
}
const FeaturedPost = ({ post }: { post: FeaturedPostType }) => {
  return (
    <Link href={`/blog/${post.id}`} className="border-[1px] p-[1px] relative aspect-video text-gray-200 px-4 min-w-100 flex flex-col anim rounded-sm bg-black/60 justify-around object-center mx-auto overflow-hidden">
      <Image src={post.coverImage}alt="" className="absolute -z-10" fill />
      {/* BADGE */}
      <p className="bg-fuchsia-700  w-fit px-1 text-xs">
        {post.category.toUpperCase()}
      </p>
      <div>
        {/* TITLE */}
        <h1 className="text-2xl font-bold font-lora">{post.title}</h1>
        {/* CONTENT */}
        <p className="sm:text-sm text-xs font-sans h-10 py-2 overflow-hidden">
          {post.description}
        </p>
        {/* AVATAR & DATE */}
        <div className="flex justify-between py-2">
          <div className="flex gap-2 items-center">
            <Image
              className="rounded-full object-fill aspect-square"
              src={post.author.avatar || '/noAvatar.jpeg'}
              width={24}
              height={24}
              alt="MV"
            />
            <p className="text-xs py-2">{post.author.username}</p>
          </div>
          <p className="text-xs py-2">
            {post.createdAt.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;
