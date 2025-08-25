"use client";
import { ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { usePost } from "@/store/EditorStore";

const categories: string[] = [
  "frontend",
  "backend",
  "devops",
  "data structures",
  "data science",
  "testing",
  "system design",
];

const NewPost = () => {
  const { setTitle, setCategory, setCoverImage } = usePost();
  const [errors, setErrors] = useState({
    titleError: "hidden",
    imageError: "hidden",
    categoryError: "hidden",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle Title
    if (e.target.name === "title") {
      const titleValue = e.target.value.trim();
      if (!titleValue) setErrors((prev) => ({ ...prev, titleError: "" }));
      else setTitle(titleValue);
    }
    // Handle Image
    if (!e.target.files) setErrors((prev) => ({ ...prev, imageError: "" }));
    else setCoverImage(e.target.files[0]);
  };
  return (
    <div className="flex flex-1 gap-4 flex-col border-[1px]  m-10 p-5">
      {/* TITLE */}
      <label htmlFor="title" className="flex flex-col">
        Add a Title:
        <input
          type="text"
          onChange={() =>
            setErrors((prev) => ({ ...prev, titleError: "hidden" }))
          }
          onBlur={(e) => handleChange(e)}
          name="title"
          placeholder="Post Title"
          id="title"
          className="outline-none border-[0.5px] rounded-sm p-2 w-[50vw]"
        />
      </label>
      <p className={`${errors.titleError} text-rose-500 text-sm`}>
        Title cannot be empty
      </p>
      {/* COVER IMAGE */}
      Add a Cover Image:
      <label htmlFor="cover-image" className="w-fit">
        <ImageIcon className="" />
        <input
          type="file"
          name="cover-image"
          onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({ ...prev, imageError: "hidden" }));
          }}
          placeholder="Post Title"
          id="cover-image"
          className="hidden w-fit"
        />
      </label>
      <p className={`${errors.imageError} text-rose-500 text-sm`}>
        Image field cannot be empty
      </p>
      {/* CATEGORY */}
      <div className="flex-col flex">
        Choose one Category:
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none border-[0.5px] rounded-sm px-2 w-fit">
            Category
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Choose One</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category, i) => (
              <DropdownMenuItem
                onClick={() => {
                  setCategory(category)
                }}
                key={category + i}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NewPost;
