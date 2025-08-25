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

const SavePost = () => {
  const { title, content, coverImage, category, setStatus, status } = usePost();
  const handleSave = ()=>{
    toast("Post Published",{
        description: 'Your post has been saved in the database',
        action:{
            label: "Close",
            onClick:()=>console.log('Post Updated')
        }
    })
    console.log(title, content, coverImage, category, status)
  }
  return (
    <div className="border-t-2 py-5 flex flex-col ml-10">
      <h2 className="text-lg text-center underline underline-offset-5">
        Don&apos;t forget to save this post here
      </h2>
      <div className="border-b-[3px] px-5 py-2 mb-4">
        <p className="font-bold text-base">
          Save<span className="text-fuchsia-500"> Draft</span> or{" "}
          <span className="text-lime-500">Publish</span>
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-fit outline-none border-[2px] anim p-1 rounded-sm">
            Save
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select save option</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatus("Draft")}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("Published")}>
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
