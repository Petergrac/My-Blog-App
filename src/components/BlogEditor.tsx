"use client";

import { Input } from "./ui/input";
import { useEditorStore } from "@/store/editStore";
import TagsForm from "./Tags";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { uploadImage } from "@/lib/upload";

const BlogEditor = () => {
  // All the content
  const {
    setTitle: saveTitle,
    title,
    data: tags,
    postContent: content,
    postState,
    setFinalPost,
    setPostState,
    setCoverImageUrl,
  } = useEditorStore(
    useShallow((state) => ({
      ...state,
    }))
  );
  const [toggleMode, setToggleMode] = useState(false);
  const handleSubmit = () => {
    if (!title) {
      return toast.error("Invalid Title");
    }
    if (!tags) {
      return toast.error("Select at least one tag");
    }
    if (!content) {
      return toast.error("Your Post can't be empty");
    }
    if (!postState) {
      return toast.error("Your post must be either published or a draft");
    }
    if (title && content && postState && tags) {
      // Create a new post with the saved content.
      const finalPost = { title, content, tags, postState };
      setFinalPost(finalPost);
      toast("Saved Successfully", {
        description: <pre>The post has been saved in the database</pre>,
      });
    } else {
      toast.error(
        "Make sure you fill all the fields. Title, Tags, CoverImage and Save Option"
      );
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files;
    if (image) {
      try {
        // Upload logic and return string url
        const url = await uploadImage(image);
        setCoverImageUrl(url);
      } catch (error) {
        toast.error("Error uploading the image");
        console.log(error);
      }
      toast.success("Image uploaded successfully");
    } else {
      toast.error("Please select an image");
    }
  };

  return (
    <div className="mt-5 border-t-3 pt-5">
      <div className="flex justify-between px-5">
        <Collapsible defaultOpen={toggleMode}>
          <div className="flex gap-2 items-center mb-3">
            <CollapsibleTrigger
              className="flex gap-3  items-center "
              onClick={() => setToggleMode((prev) => !prev)}
              asChild
            >
              <Button className="text-sm font-bold transition-all duration-400 hover:translate-y-0.5">
                Start Here
                {toggleMode ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <label htmlFor="Title" className="flex text-base flex-col gap-2">
              <div>
                <span className="text-muted-foreground">Step 1:</span> Add Title
                <span className="text-red-500"> *</span>
              </div>
              <Input
                value={title}
                onChange={(e) => saveTitle(e.target.value)}
                onBlur={() => saveTitle(title)}
                name="Title"
                placeholder="Title"
                type="text"
              />
            </label>
            <TagsForm />
            <div className="flex gap-2 mb-2">
              <span className="text-muted-foreground">Step 3:</span>Add a cover
              Image<span className="text-red-500"> *</span>
            </div>
            <label htmlFor="image">
              <Input
                name="image-cover"
                type="file"
                id="image"
                onChange={handleFileChange}
                className="hidden z-10 w-fit"
                required
              />
              <p className="py-1 px-3 text-xs bg-sky-600 text-white rounded-sm w-fit">
                Add
              </p>
            </label>
            <div>
              <h1 className="py-2 font-medium tracking-wider px-2">
                Select Save Mode<span className="text-red-500"> *</span>
              </h1>
              <Select onValueChange={(e) => setPostState(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Save Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">DRAFT</SelectItem>
                  <SelectItem value="published">PUBLISH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Button onClick={handleSubmit}>Save Post</Button>
      </div>
      <hr className="my-3 pt-2 border-2" />
      <SimpleEditor />
    </div>
  );
};

export default BlogEditor;
