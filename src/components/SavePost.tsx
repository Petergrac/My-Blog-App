"use client";

import { CheckCircle2, Circle, Rocket, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { newPost } from "@/actions/PostActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePost } from "@/store/EditorStore";

const SavePost = () => {
  const {
    title,
    content,
    coverImage,
    category,
    setStatus,
    status,
    description,
  } = usePost();
  const router = useRouter();

  const checklist = [
    {
      label: "Title written",
      complete: !!title && title.trim().length >= 5,
    },
    {
      label: "Description added",
      complete: !!description && description.trim().length >= 10,
    },
    {
      label: "Cover uploaded",
      complete: !!coverImage,
    },
    {
      label: "Category selected",
      complete: !!category,
    },
    {
      label: "Content drafted",
      complete: !!content?.content?.length,
    },
  ];

  const handleSave = async () => {
    if (!title || title.trim() === "") {
      toast.error("Title cannot be empty.");
      return;
    }

    if (!content?.content?.length) {
      toast.error("Content cannot be empty.");
      return;
    }

    if (!coverImage) {
      toast.error("Cover image is required.");
      return;
    }

    if (!category) {
      toast.error("Choose at least one category.");
      return;
    }

    if (!description || description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long.");
      return;
    }

    const finalPost = {
      title: title.trim(),
      category,
      coverImage,
      state: status,
      content: JSON.stringify(content),
      description: description.trim(),
    };

    try {
      const result = await newPost(finalPost);

      if ("data" in result) {
        const { data: createdPost } = result;

        if (status === "DRAFT") {
          toast.warning("Post saved as draft.");
          router.push("/blog/my-blogs");
        } else {
          toast.success("Post published.");
          router.push(`/blog/${createdPost.id}`);
        }
      } else {
        toast.error("Authentication failed. Only authors can publish.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Post could not be saved.");
    }
  };

  return (
    <Card className="border-border/70 bg-card/90 shadow-lg">
      <CardHeader className="border-b border-border/60 bg-muted/30">
        <Badge className="w-fit" variant="outline">
          Publish controls
        </Badge>
        <CardTitle className="text-2xl">Ready to ship?</CardTitle>
        <CardDescription>
          Choose how this post should be saved, then run through the final
          checklist before you publish.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as "DRAFT" | "PUBLISHED")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose how to save this post" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Save as draft</SelectItem>
              <SelectItem value="PUBLISHED">Publish now</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs leading-5 text-muted-foreground">
            Drafts stay in your workspace. Published posts go straight to the
            public reading experience.
          </p>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
            >
              <span className="text-sm">{item.label}</span>
              {item.complete ? (
                <CheckCircle2 className="size-4 text-lime-500" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm leading-6 text-muted-foreground">
          {status === "DRAFT" ? (
            <div className="flex items-start gap-3">
              <Save className="mt-0.5 size-4 shrink-0 text-sky-500" />
              <p>
                Draft mode is useful when you want to refine the content later
                without sending readers to an unfinished piece.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Rocket className="mt-0.5 size-4 shrink-0 text-sky-500" />
              <p>
                Publish mode pushes the story live immediately, so make sure the
                metadata and editor content are final.
              </p>
            </div>
          )}
        </div>

        <Button
          className="w-full bg-sky-500 text-black hover:bg-sky-400"
          onClick={handleSave}
          size="lg"
          type="button"
        >
          {status === "DRAFT" ? "Save Draft" : "Publish Post"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavePost;
