import { create } from "zustand";
import { JSONContent } from "@tiptap/react";

// Post type
interface Post {
  title: string | null;
  setTitle: (title: string | null) => void;
  coverImage: File | null;
  setCoverImage: (coverImage: File | null) => void;
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
  content: null,
  setContent: (content) => set({ content }),
  coverImage: null,
  setCoverImage: (coverImage) => set({ coverImage }),
  category: null,
  setCategory: (category) => set({ category }),
  status: "Draft",
  setStatus: (status) => set({ status }),
}));
