import { MessageCircle, ThumbsUp, TrendingUpIcon } from "lucide-react";
import Image from "next/image";
const AuthorHeader = ({
  postCount,
  author,
}: {
  postCount: {
    comments: number;
    likes: number;
  }[];
  author: {
    username: string | null;
    bio: string | null;
    avatar: string | null;
  };
}) => {
  if (!author) {
    return null;
  }

  const totalComments = postCount.reduce((sum, post) => sum + post.comments, 0);
  const totalLikes = postCount.reduce((sum, post) => sum + post.likes, 0);
  return (
    <div>
      {/* AUTHOR BLOGS NAV */}
      <div className="flex justify-between items-center border-b-4">
        {/* AUTHOR NAME & AVATAR */}
        <div className="flex gap-2 items-center border-t py-10">
          {/* AVATAR */}
          <Image
            src={author.avatar || "/noAvatar.jpeg"}
            alt="avatar"
            width={30}
            className="aspect-square rounded-full"
            height={30}
          />
          {/* NAME */}
          <div className="">
            <h1 className="text-lg">
              Welcome <span className="text-cyan-500">{author.username}</span>
            </h1>
            <p className="text-xs sm:block hidden">
              We are happy to see you.
              <br />
              It&apos;s great to share your knowledge with other people
            </p>
          </div>
        </div>
        {/* AT GLANCE STATISTICS */}
        <div className="">
          <h3 className="font-serif text-center py-2 underline underline-offset-4 text-lg">
            Your activity
          </h3>
          <div className="flex items-center gap-4">
            <p className="text-sm flex items-center gap-2">
              Posts <TrendingUpIcon className="text-green-500" />{" "}
              {postCount.length}{" "}
            </p>
            <p className="text-sm flex items-center gap-2">
              <MessageCircle className="text-sky-500" />
              {totalComments}
            </p>
            <p className="flex items-center gap-2 text-sm">
            <ThumbsUp className="text-cyan-500" /> {totalLikes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthorHeader;
