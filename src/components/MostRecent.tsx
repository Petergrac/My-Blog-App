
import Image from "next/image";
import Link from "next/link";
import { FeaturedPostType } from "./FeaturedPost";
import {
  MessageCircle,
  MoreVertical,
  Pencil,
  Printer,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { PostType } from "./BlogAuthor";
import { deletePost, patchPost } from "@/actions/PostActions";
import { toast } from "sonner";

const MostRecent = ({
  post,
  isAuthor,
}: {
  post: FeaturedPostType & PostType;
  isAuthor?: boolean;
}) => {
  // Save the post changes.
  const handlePostChange = async (type: string) => {
    if (type === "draft") {
      try {
        await patchPost({ state: "PUBLISHED" }, post.id);
        toast.success("Post successfully published");
      } catch (error) {
        console.log(error);
        toast.error("Could not publish the post");
      }
    } else if (type === "delete") {
      try {
        await deletePost(post.id);
        toast.success("Post successfully deleted");
      } catch (error) {
        console.log(error);
        toast.error("Post could not be deleted!");
      }
    }
  };

  return (
    <div
      className={`anim border-[1px] flex flex-col justify-around rounded-sm  overflow-hidden  min-w-52 max-w-53 px-2 shadow-md ${
        !isAuthor && "mx-auto"
      }`}
    >
      {/* BADGE */}
      <Link href={`/blog/${post.id}`} className="relative">
        <p className="absolute top-2 left-1 text-gray-200 bg-fuchsia-600 px-1 text-xs">
          {post.category}
        </p>
        <Image
          src={post.coverImage}
          className="hover:scale-120 duration-500 h-30 overflow-hidden"
          alt="home"
          width={200}
          height={100}
        />
      </Link>
      {/* TITLE & CONTENT */}
      <div className="flex flex-col justify-between pb-2 border-b-[1px]">
        {/* TITLE */}
        <h1 className="font-lora text-sm font-semibold py-3">{post.title}</h1>
        {/* CONTENT */}
        <div className="">
          <p className={`h-5 text-xs overflow-hidden`}>
            {post.description}
          </p>
        </div>
      </div>
      {/* AUTHOR AND DATE */}
      <div className="flex justify-between py-3 flex-wrap gap-3 items-center">
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
      {isAuthor && (
        <div className="flex justify-between items-center pb-4">
          {/* COMMENTS & LIKES */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center hover:text-pink-500 ">
              <MessageCircle size={20} className="" />
              <span className="text-xs">
                {(post._count && post._count.comments) || 0}
              </span>
            </div>
            <div className="flex gap-1 items-center hover:text-cyan-500 ">
              <ThumbsUp size={20} />
              <span className="text-xs">
                {(post._count && post._count.likes) || 0}
              </span>
            </div>
          </div>
          {/* POST STATE */}
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {post.state === "DRAFT" && (
                  <DropdownMenuItem onClick={() => handlePostChange("draft")}>
                    <Printer /> Publish
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Pencil /> <Link href={`/blog/edit/${post.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePostChange("delete")}
                  className="text-red-500"
                >
                  <Trash2 color="red" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
};

export default MostRecent;
