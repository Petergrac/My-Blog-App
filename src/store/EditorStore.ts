import { create } from "zustand";
import { JSONContent } from "@tiptap/react";
import defaultContent from "@/components/tiptap-templates/simple/data/content";

// Post type
interface Post {
  title: string | null;
  setTitle: (title: string | null) => void;
  coverImage: string | undefined;
  setCoverImage: (coverImage: string | undefined) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  status: "Published" | "Draft";
  setStatus: (status: "Published" | "Draft") => void;
  content: JSONContent | null;
  setContent: (content: JSONContent | null) => void;
}

// The post store
export const usePost = create<Post>((set) => ({
  title: "",
  setTitle: (title) => set({ title }),
  content: defaultContent,
  setContent: (content) => set({ content }),
  coverImage: undefined,
  setCoverImage: (coverImage) => set({ coverImage }),
  description: null,
  setDescription: (description) => set({ description }),
  category: null,
  setCategory: (category) => set({ category }),
  status: "Draft",
  setStatus: (status) => set({ status }),
}));
