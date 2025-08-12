import { Heading } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";

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
