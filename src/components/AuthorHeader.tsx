import { MessageCircle, PenBox, ThumbsUp } from "lucide-react";
import Image from "next/image";

import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

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
    <Card className="overflow-hidden border-border/70 bg-card/95 shadow-lg">
      <CardContent className="grid gap-6 p-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5 p-6 md:p-8">
          <Badge className="w-fit" variant="outline">
            Author dashboard
          </Badge>
          <div className="flex items-center gap-4">
            <div className="relative size-16 overflow-hidden rounded-full border border-border/70">
              <Image
                alt={author.username || "Author avatar"}
                className="object-cover"
                fill
                src={author.avatar || "/noAvatar.jpeg"}
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {author.username || "Anonymous author"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage drafts, check engagement, and keep your publishing flow
                moving.
              </p>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {author.bio ||
              "Add a bio in your profile to make your workspace feel more complete to readers and collaborators."}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-b-xl bg-border/60 lg:rounded-bl-none lg:rounded-r-xl">
          <div className="grid grid-cols-3 gap-px">
            <div className="bg-muted/20 p-5 text-center">
              <PenBox className="mx-auto size-5 text-sky-500" />
              <p className="mt-3 text-2xl font-semibold">{postCount.length}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Posts
              </p>
            </div>
            <div className="bg-muted/20 p-5 text-center">
              <MessageCircle className="mx-auto size-5 text-emerald-500" />
              <p className="mt-3 text-2xl font-semibold">{totalComments}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Comments
              </p>
            </div>
            <div className="bg-muted/20 p-5 text-center">
              <ThumbsUp className="mx-auto size-5 text-amber-500" />
              <p className="mt-3 text-2xl font-semibold">{totalLikes}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Likes
              </p>
            </div>
          </div>
          <div className="bg-sky-500/8 px-5 py-4 text-sm leading-6 text-muted-foreground">
            Published work and drafts now live in the same cleaner workspace, so
            you can move from revision to launch without jumping between views.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorHeader;
