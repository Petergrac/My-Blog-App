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
import { ArrowLeftCircle, ChevronDown, ChevronUp } from "lucide-react";

const BlogEditor = () => {
  const saveTitle = useEditorStore((state) => state.setTitle);
  const title = useEditorStore((state) => state.title);
  const tags = useEditorStore((state) => state.data);
  const content = useEditorStore((state) => state.postContent);
  const postState = useEditorStore((state) => state.postState);

  const [toggleMode, setToggleMode] = useState(false);
  const setPostState = useEditorStore((state) => state.setPostState);
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
      const newPost = JSON.stringify(
        { title, content, tags, postState },
        null,
        2
      );

      return toast("Saved Successfully", {
        description: <pre>The post has been saved in the database</pre>,
      });
    } else {
      toast.error(
        "Make sure you fill all the fields. Title, Tags, CoverImage and Save Option"
      );
    }
  };

  return (
    <div className="mx-auto md:pl-4 min-w-[90vw]">
      <div className="flex justify-between md:justify-around">
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
            <p className="md:flex hidden gap-1 text-sm">
              <ArrowLeftCircle className="hover:-translate-x-0.5 transition-all duration-500" />
              Add Title, Tags and Cover Image here.
            </p>
          </div>
          <CollapsibleContent>
            <label
              htmlFor="Title"
              className="flex text-base flex-col gap-2 w-1/2"
            >
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
            <div>
              <TagsForm />
            </div>
            <div>
              <label htmlFor="image">
                <div className="flex gap-2 mb-2">
                  <span className="text-muted-foreground">Step 3:</span>Add a
                  cover Image<span className="text-red-500"> *</span>
                </div>
                <Input
                  name="image-cover"
                  type="file"
                  className="flex w-fit rounded-full "
                  required
                />
              </label>
            </div>
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
        <div>
          <Button onClick={handleSubmit}>Save Post</Button>
        </div>
      </div>
      <div className="pt-2">
        <hr className="my-3 border-2" />
        <SimpleEditor />
      </div>
    </div>
  );
};

export default BlogEditor;
