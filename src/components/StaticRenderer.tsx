import React from "react";
import StarterKit from "@tiptap/starter-kit";
import { renderToHTMLString } from "@tiptap/static-renderer";
import { JSONContent } from "@tiptap/core";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Typography from "@tiptap/extension-typography";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Selection } from "@tiptap/extensions";
import "@/styles/renderer.scss";

interface EditorProps {
  content: JSONContent;
}

const StaticRenderer = ({ content }: EditorProps) => {
  const html = renderToHTMLString({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    content,
  });
  return (
    <div
      className="tiptap ProseMirror m-10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default StaticRenderer;
