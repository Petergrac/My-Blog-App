import prisma from "@/lib/prisma";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { auth } from "@clerk/nextjs/server";
import UpdatePost from "@/components/UpdatePost";
import { redirect } from "next/navigation";


const UpdateBlog = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  //   Get the post to edit.
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      author: {
        select: {
          clerkId: true,
        },
      },
    },
  });

 

  if (!post) redirect('/')
   const { userId } = await auth();

  if (post?.author.clerkId !== userId) {
      redirect('/unauthorized')
  }
  const postDetails = {
    title: post.title,
    category: post.category,
    coverImage: post.coverImage,
    content: post.content,
    description: post.description,
    state: post.state,
  };
  
  const postContent = JSON.parse(postDetails.content)
  return (
    <div className="flex flex-col">
      {/*EDIT POST TITLE e.t.c */}
      <UpdatePost postDetails={postDetails} id={id} />
      <h2 className="text-center py-4 text-2xl underline ">
        Edit your post content.
      </h2>
      <SimpleEditor updateContent={postContent}  />
    </div>
  );
};

export default UpdateBlog;
