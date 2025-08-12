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
console.log(toc)
export default toc;

