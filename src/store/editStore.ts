import { JSONContent } from "@tiptap/core";
import { create } from "zustand";

type EditorState = {
  postContent: Node | JSONContent | undefined;
  title: string | null;
  setPostContent: (content: Node | JSONContent | undefined) => void;
  setTitle: (title: string | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  postContent: undefined,
  setPostContent: (postContent) => set({ postContent }),
  title: '',
  setTitle: (title)=>set({title})
}));
