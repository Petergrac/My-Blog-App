"use client";
import { usePost } from "@/store/EditorStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { newPost } from "@/actions/PostActions";

const SavePost = () => {
  const {
    title,
    content,
    coverImage,
    category,
    setStatus,
    status,
    description,
  } = usePost();
  const handleSave = async () => {
    if (title?.trim() === "" || title === null) {
      toast.error("Title Cannot be empty");
      return;
    } else if (content?.content === undefined) {
      toast.error("Content cannot be empty");
      return;
    } else if (coverImage === undefined) {
      toast.error("Cover image is needed");
      return;
    } else if (category === null) {
      toast.error("Choose atleast one category.");
      return;
    } else if (status === "DRAFT") {
      toast.warning("Post saved as draft");
      return;
    } else if (
      !description ||
      description.trim() === "" ||
      description.trim().length < 10
    ) {
      toast.error(
        "Description is needed and must be at least 10 characters long"
      );
      return;
    } else {
      const newContent = JSON.stringify(content);
      const finalPost = {
        title,
        category,
        coverImage,
        state: status,
        content: newContent,
        description,
      };
      try {
        await newPost(finalPost);
        toast.success("Post Published", {
          description: title,
          action: {
            label: "X",
            onClick: () => console.log("Post Updated"),
          },
        });
      } catch (error) {
        console.log(error);
        toast.error("Internal server error, Post could not be saved")
      }
    }
  };
  return (
    <div className="border-t-2 py-5 flex flex-col ml-10">
      <h2 className="text-lg text-center underline underline-offset-5">
        Don&apos;t forget to save this post here
      </h2>
      <div className="border-b-[3px] px-5 py-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="anim border-[1px] p-1 rounded-sm">
            <p className="font-bold text-base">
              Save<span className="text-fuchsia-500"> Draft</span> or{" "}
              <span className="text-lime-500">Publish</span>
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              Select save option: Default =&gt;
              <span className="text-lime-300">Draft</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatus("DRAFT")}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("PUBLISHED")}>
              Published
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <button
        onClick={handleSave}
        className="px-2 py-1 w-fit rounded-sm mx-auto bg-amber-500 text-white/75 font-bold anim"
      >
        Upload
      </button>
    </div>
  );
};

export default SavePost;
