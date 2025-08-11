"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { useEditorStore } from "@/store/editStore";
import TagsForm from "./Tags";

const Title = () => {
  const saveTitle = useEditorStore((state) => state.setTitle);
  const [title, setTitle] = useState("");
  return (
    <div>
      <label
        htmlFor="Title"
        className="flex text-base flex-col gap-2 font-medium w-1/2"
      >
        <div>
          <span className="text-muted-foreground">Step 1:</span> Add Title
        </div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => saveTitle(title)}
          name="Title"
          placeholder="Title"
          type="text"
        />
      </label>
      <TagsForm />
      <div>
        <label htmlFor="image">
          <div className="flex gap-2 mb-2">
            <span className="text-muted-foreground">Step 3:</span>
            <p className="text-base font-medium">Enter a cover Image *</p>
          </div>
          <Input type="file" className="w-1/2" required />
        </label>
      </div>
      <p className="text-base font-medium mt-2 mb-3">
        <span className="text-muted-foreground">Step 4: </span>Enjoy writing your blog.
      </p>
    </div>
  );
};

export default Title;
