import { Node, mergeAttributes } from "@tiptap/core";
import hljs from "highlight.js";

export const CodeBlockHighlight = Node.create({
  name: "codeBlock",

  group: "block",
  content: "text*",
  marks: "",
  code: true,

  defining: true,

  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: element => element.getAttribute("data-language") || null,
        renderHTML: attributes => {
          if (!attributes.language) return {};
          return { "data-language": attributes.language };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "pre" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const textContent = node.textContent || "";
    const { value, language } = hljs.highlightAuto(textContent);

    return [
      "pre",
      mergeAttributes(HTMLAttributes),
      [
        "code",
        { class: `hljs language-${language}` },
        value, // Will be replaced by innerHTML from highlight.js
      ],
    ];
  },
});
