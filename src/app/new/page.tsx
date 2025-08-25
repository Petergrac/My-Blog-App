import NewPost from "@/components/NewPost";
import SavePost from "@/components/SavePost";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function Editor() {
  return (
    <div className="flex flex-col">
      <h1 className="text-center py-4 text-2xl">Create a New Post</h1>
      {/* POST TITLE e.t.c */}
      <NewPost />
      <h2 className="text-center py-4 text-2xl underline ">
        Explore Cool Extensions on our Editor.
      </h2>
      <SimpleEditor />
      {/* SAVE BUTTON */}
      <SavePost />
    </div>
  );
}
