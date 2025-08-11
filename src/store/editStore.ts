import { JSONContent } from "@tiptap/core";
import { create } from "zustand";

type EditorState = {
  postContent: Node | JSONContent | undefined;
  title: string | undefined;
  setPostContent: (content: Node | JSONContent | undefined) => void;
  setTitle: (title: string | undefined) => void;
  data: object | null;
  setData: (data: object | null) => void;
  postState: string | null;
  setPostState: (postState: string | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  postContent: undefined,
  setPostContent: (postContent) => set({ postContent }),
  title: "",
  setTitle: (title) => set({ title }),
  data: null,
  setData: (data) => set({ data }),
  postState: null,
  setPostState: (postState) => set({ postState }),
}));
