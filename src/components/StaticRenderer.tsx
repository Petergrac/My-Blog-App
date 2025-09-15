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
import "highlight.js/styles/atom-one-dark.css";
import "@/styles/renderer.scss";
import { highlightCodeBlocks } from "@/lib/highlight";
import { processContent } from "@/lib/postProcessor";
import ActiveToc from "./TOC";

interface EditorProps {
  content: JSONContent;
}
const StaticRenderer = async ({ content }: EditorProps) => {
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
  // Highlight the code
  const highlightHTML = await highlightCodeBlocks(html);
  // Optimize image and create the toc
  const { html: finaltHTML, toc } = processContent(highlightHTML);
  return (
    <div className="flex gap-5 outline-4">
        <ActiveToc toc={toc} />
      <div
        className="tiptap ProseMirror sm:mx-5 sen w-screen min-h-screen shadow-lg p-3 text-lg "
        dangerouslySetInnerHTML={{ __html: finaltHTML }}
      />
    </div>
  );
};
export default StaticRenderer;
