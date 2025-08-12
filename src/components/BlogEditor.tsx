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

const BlogEditor = () => {
  const saveTitle = useEditorStore((state) => state.setTitle);
  const title = useEditorStore((state) => state.title);
  const tags = useEditorStore((state) => state.data);
  const content = useEditorStore((state) => state.postContent);
  const postState = useEditorStore((state) => state.postState);

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
      <label
        htmlFor="Title"
        className="flex text-base flex-col gap-2 font-medium w-1/2"
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
            <span className="text-muted-foreground">Step 3:</span>
          </div>
          <Input name="image-cover" type="file" className="w-1/2" required />
        </label>
      </div>
      <hr className="my-3 border-2" />
      <div className="pt-2">
        <p className="text-center underline pb-0.5 text-base font-medium mt-2 mb-3">
          Time to write something.{" "}
          <span className="text-sky-500">Good Luck!</span>
        </p>
         <hr className="my-3 border-2" />
        <SimpleEditor />
      </div>
      <div className="border-t-2 mt-3 pt-2 pl-3 pb-4">
        <h1 className="py-2 font-medium tracking-wider px-2">
          Select Post Mode<span className="text-red-500"> *</span>
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
       <hr className="my-3 border-2" />
      <Button className="ml-3 mb-5" onClick={handleSubmit}>
        Publish
      </Button>
    </div>
  );
};

export default BlogEditor;
