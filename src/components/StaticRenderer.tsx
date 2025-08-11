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
import content from "@/components/tiptap-templates/simple/data/content.json";
import "@/components/tiptap-templates/simple/simple-editor.scss"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function BlogPost() {
  const html = renderToHTMLString({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
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
    <div className="simple-editor-content">
      <div
        className="tiptap ProseMirror simple-editor"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
