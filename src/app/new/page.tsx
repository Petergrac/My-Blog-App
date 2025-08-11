import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const Tiptap = () => {
  return (
    <div className="px-4 pt-3">
      <h1 className="text-center py-3 text-xl font-bold text-foreground/80 bg-cyan-600 rounded-md">
        Welcome to tiptap Editor
      </h1>
      <SimpleEditor />
    </div>
  );
};

export default Tiptap;
