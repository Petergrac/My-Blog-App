import { Heading } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";
import contentJson from "@/components/tiptap-templates/simple/data/content.json"
export interface TocItem {
  id: string;
  text: string;
}
export interface ProseMirrorTextNode {
  type: "text";
  text: string;
}
export interface ProseMirrorHeadingNode {
  type: "heading";
  attrs?: {
    textAlign?: string | null;
    level?: number;
  };
  content?: ProseMirrorTextNode[];
}
export interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
  text?: string;
}

// 
// ===================== 
//    Adds ID in the HTML 
// ======================
//
export const HeadingWithId = Heading.extend({
    // Adding id attribute 
    addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    let id = HTMLAttributes.id;

    // If there's no id, generate one from the heading's textContent
    if (!id && node.textContent) {
      id = node.textContent
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    }

    return [
      `h${node.attrs.level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { id }),
      0,
    ];
  },
});
// 
// ===================== 
//    Generates A Table of Content From The HTML
// ======================
//

export function generateTOC(content: ProseMirrorNode): TocItem[] {
  const toc: TocItem[] = [];

  function walk(node: ProseMirrorNode) {
    if (node.type === "heading" && node.content && node.content.length > 0) {
      const textNode = node.content.find(
        (c): c is ProseMirrorTextNode => c.type === "text" && typeof c.text === "string"
      );

      if (textNode) {
        const id = textNode.text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "") // remove special characters
          .trim()
          .replace(/\s+/g, "-");

        toc.push({ id, text: textNode.text });
      }
    }
    if (node.content) {
      node.content.forEach(walk);
    }
  }

  walk(content);
  return toc;
}

const toc = generateTOC({
  type: "doc",
  content: contentJson.content as ProseMirrorNode[]
});
export default toc;

