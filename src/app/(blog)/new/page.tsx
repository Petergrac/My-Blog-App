import NewPost from "@/components/NewPost";
import SavePost from "@/components/SavePost";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Editor() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-10 flex max-w-4xl flex-col gap-4">
        <Badge className="w-fit" variant="outline">
          Author workspace
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Create a post in a calmer writing flow.
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Start with the setup card, draft in the full-width editor, then finish
          with the publishing controls at the bottom.
        </p>
      </div>

      <div className="space-y-6">
        <NewPost />
        <Card className="overflow-hidden border-border/70 bg-card/95 shadow-xl">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <CardTitle className="text-2xl">Editor canvas</CardTitle>
            <CardDescription>
              The writing surface now takes the width it needs, with setup above
              and publishing below.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <SimpleEditor />
          </CardContent>
        </Card>
        <SavePost />
      </div>
    </div>
  );
}
