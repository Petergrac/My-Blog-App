import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";

const Tiptap = () => {
  return (
    <div className="pl-4 pt-3">
      <Title />
      <SimpleEditor />
    </div>
  );
};

export default Tiptap;
