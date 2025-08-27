import Image from "next/image";
import Link from "next/link";
import { FeaturedPostType } from "./FeaturedPost";

const MostRecent = ({ post }: { post: FeaturedPostType }) => {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="anim mx-auto border-[1px] flex flex-col justify-around rounded-sm  overflow-hidden  w-52 px-2 shadow-md"
    >
      {/* BADGE */}
      <div className="relative">
        <p className="absolute top-2 left-1 text-gray-200 bg-fuchsia-600 px-1 text-xs">
          {post.category}
        </p>
        <Image
          src={post.coverImage}
          className="hover:scale-120 duration-500"
          alt="home"
          width={200}
          height={100}
        />
      </div>
      {/* TITLE & CONTENT */}
      <div className="flex flex-col justify-between pb-2 border-b-[1px]">
        {/* TITLE */}
        <h1 className="font-lora text-sm font-semibold py-3">{post.title}</h1>
        {/* CONTENT */}
        <p className="text-xs overflow-hidden h-5 ">{post.description}</p>
      </div>
      {/* AUTHOR AND DATE */}
      <div className="flex justify-between py-3 items-center">
        {/* AUTHOR */}
        <div className="flex gap-2 items-center">
          <Image
            src={post.author.avatar || "/noAvatar.jpeg"}
            alt="home"
            width={24}
            className="rounded-full aspect-square"
            height={24}
          />
          <p className="text-xs">{post.author.username}</p>
        </div>
        {/* DATE */}
        <p className="text-xs">
          {post.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
};

export default MostRecent;
