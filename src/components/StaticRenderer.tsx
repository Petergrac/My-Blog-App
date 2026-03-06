import StarterKit from "@tiptap/starter-kit";
import { renderToHTMLString } from "@tiptap/static-renderer";

import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import "highlight.js/styles/atom-one-dark.css";

import { highlightCodeBlocks } from "@/lib/highlight";
import { processContent } from "@/lib/postProcessor";
import "@/styles/renderer.scss";
import ActiveToc from "./TOC";

type JSONContent = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JSONContent[];
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
};

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

  const highlightedHTML = await highlightCodeBlocks(html);
  const { html: finalHTML, toc } = processContent(highlightedHTML);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <div className="xl:hidden">
          <ActiveToc toc={toc} variant="mobile" />
        </div>
        <article className="article-renderer rounded-[2rem] border border-border/70 bg-card/95 shadow-sm">
          <div
            className="article-prose tiptap ProseMirror sen p-5 md:p-8 xl:p-10"
            dangerouslySetInnerHTML={{ __html: finalHTML }}
            data-article-body
          />
        </article>
      </div>
      <div className="hidden xl:block">
        <ActiveToc toc={toc} variant="desktop" />
      </div>
    </div>
  );
};

export default StaticRenderer;
