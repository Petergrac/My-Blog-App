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
  status: "PUBLISHED" | "DRAFT";
  setStatus: (status: "PUBLISHED" | "DRAFT") => void;
  content: JSONContent | null;
  setContent: (content: JSONContent | null) => void;
}

interface User{
  id: string | null;
  setId: (id: string |null)=>void;
  username: string | null;
  setUsername: (username: string | null)=>void;
  avatar: string | null;
  setAvatar: (avatar: string | null)=>void;
}

export const useCurrentUser = create<User>((set)=>({
  id: null,
  setId:(id)=>set({id}),
  username: null,
  setUsername: (username)=>set({username}),
  avatar: null,
  setAvatar: (avatar)=>set({avatar})
}))
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
  status: "DRAFT",
  setStatus: (status) => set({ status }),
}));
