import { Editor, JSONContent } from "@tiptap/react";
import { create } from "zustand";
import defaultData from "@/components/data/test.json";

type EditorStateType = {
  postContent: Node | JSONContent | undefined;
  title: string | undefined;
  setPostContent: (content: Node | JSONContent | undefined) => void;
  setTitle: (title: string | undefined) => void;
  data: object | null;
  setData: (data: object | null) => void;
  postState: string | null;
  setPostState: (postState: string | null) => void;
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  finalPost: FinalPost | null;
  setFinalPost: (finalPost: FinalPost) => void;
  coverImageUrl: string | undefined
  setCoverImageUrl: (coverImageUrl: string | undefined)=>void
};

interface FinalPost{
  title: string | undefined;
  tags: object | null 
  content: Node | JSONContent | undefined;
  postState: string
}

export const useEditorStore = create<EditorStateType>((set) => ({
  postContent: defaultData,
  setPostContent: (postContent) => set({ postContent }),
  title: "",
  setTitle: (title) => set({ title }),
  data: null,
  setData: (data) => set({ data }),
  postState: null,
  setPostState: (postState) => set({ postState }),
  editor: null,
  setEditor: (editor) => set({ editor }),
  finalPost: null,
  setFinalPost: (finalPost) => set({ finalPost }),
  coverImageUrl: undefined,
  setCoverImageUrl: (coverImageUrl)=>set({coverImageUrl})
}));
