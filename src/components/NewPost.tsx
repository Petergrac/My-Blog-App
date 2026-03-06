"use client";

import Image from "next/image";
import { ImagePlus, PenSquare, Shapes } from "lucide-react";

import UploadExample from "./ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { usePost } from "@/store/EditorStore";
import { postCategories } from "@/lib/categories";

const NewPost = () => {
  const {
    title,
    category,
    description,
    coverImage,
    setTitle,
    setCategory,
    setDescription,
  } = usePost();

  return (
    <Card className="border-border/70 bg-card/90 shadow-lg">
      <CardHeader className="border-b border-border/60 bg-muted/30">
        <Badge className="w-fit" variant="outline">
          Draft setup
        </Badge>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PenSquare className="size-5 text-sky-500" />
          Shape the post before you write
        </CardTitle>
        <CardDescription>
          Set the headline, summary, category, and cover in one place before
          moving into the editor canvas.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="Designing reliable systems for busy teams"
              value={title ?? ""}
              onChange={(event) => setTitle(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Aim for a specific headline that signals value immediately.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-description">Short description</Label>
            <Textarea
              id="post-description"
              placeholder="Summarize the key takeaway in one or two sharp sentences."
              rows={5}
              value={description ?? ""}
              onChange={(event) => setDescription(event.target.value)}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Used in cards, previews, and metadata.</span>
              <span>{description?.length ?? 0}/140</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category ?? undefined}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {postCategories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
              <Shapes className="mt-0.5 size-4 shrink-0" />
              <p>
                Category selection helps the landing page, discovery feed, and
                author dashboard stay organized.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-border/70 bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium">Cover image</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a strong visual anchor for cards, story previews, and the
              landing page spotlight.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-background">
            {coverImage ? (
              <div className="relative aspect-[16/10]">
                <Image
                  alt="Uploaded cover preview"
                  className="object-cover"
                  fill
                  src={coverImage}
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                Upload an image and it will appear here as your live preview.
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ImagePlus className="size-4 text-sky-500" />
              Asset upload
            </div>
            <UploadExample />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewPost;
