"use client";
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
import UploadExample from "./ImageUpload";

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
  const { setTitle, setCategory, setDescription } = usePost();
  const [errors, setErrors] = useState({
    titleError: "hidden",
    imageError: "hidden",
    categoryError: "hidden",
  });
  const [selectedCategory, setSelectedCategory] = useState("Category");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle Title
    if (e.target.name === "title") {
      const titleValue = e.target.value.trim();
      if (!titleValue) {
        setErrors((prev) => ({ ...prev, titleError: "" }));
      } else {
        setTitle(titleValue);
        setErrors((prev) => ({ ...prev, titleError: "hidden" }));
      }
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategory(category);
    setErrors((prev) => ({ ...prev, categoryError: "hidden" }));
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto my-10 p-8 border  rounded-lg shadow-lg space-y-8">
      <h1 className="text-2xl font-bold text-center">Create a New Post</h1>

      {/* TITLE SECTION */}
      <div className="space-y-2">
        <label htmlFor="title" className="font-medium">
          Post Title:
        </label>
        <input
          type="text"
          name="title"
          onChange={(e) => handleChange(e)}
          onBlur={(e) => handleChange(e)}
          placeholder="Enter a compelling title"
          id="title"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <p className={`${errors.titleError} text-rose-500 text-sm mt-1`}>
          Title cannot be empty
        </p>
      </div>

      {/* COVER IMAGE SECTION */}
      <div className="space-y-2">
        <UploadExample />
      </div>
      {/* SHORT DESCRIPTION */}
      <div className="flex items-start gap-2 flex-col justify-center">
        Add a short description:
        <textarea
          className="outline-none border-[2px] rounded-sm p-2"
          placeholder="Description"
          minLength={20}
          maxLength={100}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
        />
      </div>
      {/* CATEGORY SECTION */}
      <div className="space-y-2">
        <span className="font-medium text-gray-500">Choose a Category:</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full p-3 flex justify-between items-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <span>{selectedCategory}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuLabel className="text-black">
              Available Categories
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category, i) => (
              <DropdownMenuItem
                onClick={() => handleCategorySelect(category)}
                key={category + i}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <p className={`${errors.categoryError} text-rose-500 text-sm mt-1`}>
          Category cannot be empty
        </p>
      </div>
    </div>
  );
};

export default NewPost;
