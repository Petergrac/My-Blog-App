import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import UpdatePost from "@/components/editor/UpdatePost";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const UpdateBlog = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  //   Get the post to edit.
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      author: {
        select: {
          id: true,
        },
      },
    },
  });

 

  if (!post) redirect('/');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || post?.author.id !== userId) {
    redirect('/unauthorized');
  }
  const postDetails = {
    title: post.title,
    category: post.category,
    coverImage: post.coverImage,
    content: post.content,
    description: post.description,
    state: post.state,
  };
  
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-10 flex max-w-4xl flex-col gap-4">
        <Badge className="w-fit" variant="outline">
          Edit mode
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Refine the story without losing the flow.
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          The edit flow now follows the same rhythm as creation: setup at the
          top, full-width writing in the middle, publish controls at the
          bottom.
        </p>
      </div>

      <UpdatePost postDetails={postDetails} id={id} />
    </div>
  );
};

export default UpdateBlog;
