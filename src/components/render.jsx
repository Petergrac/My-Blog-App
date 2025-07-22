import Prism from "prismjs";
import { useEffect } from "react";

export default function RenderContent({ content }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div
      className="prose dark:prose-invert max-w-none px-20"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
