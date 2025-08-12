import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import "@/components/render-post.scss"

import { useEditorStore } from "@/store/editStore";
import { HeadingWithId } from "./config/GenerateId";

export default function BlogPost() {
  const content = useEditorStore((state) => state.postContent);
  if (content) {
    const html = renderToHTMLString({
      extensions: [
        StarterKit.configure({
          horizontalRule: false,
          link: {
            openOnClick: false,
            enableClickSelection: true,
          },
          heading: false
        }),
        HeadingWithId.configure({
            levels: [1,2,3]
        }),
        Highlight.configure({ multicolor: true }),
        Image,
        Link,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Superscript,
        Subscript,
        Typography,
        TaskList,
        TaskItem.configure({ nested: true }),
        HorizontalRule,
      ],
      content,
    });
    return (
      <div className="simple-editor-content mx-5 overflow-y-auto max-h-screen md:max-w-[70vw] px-2">
        <div
          className="tiptap ProseMirror simple-editor"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }
}
