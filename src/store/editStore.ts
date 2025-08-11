import { JSONContent } from "@tiptap/core";
import { create } from "zustand";

type EditorState = {
  content: Node | JSONContent | undefined;
  setContent: (content: Node | JSONContent | undefined) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  content: undefined,
  setContent: (content) => set({ content }),
}));
