"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLine, Rocket, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { patchPost } from "@/actions/PostActions";
import { postCategories, postCategoryValues } from "@/lib/categories";
import { usePost } from "@/store/EditorStore";
import UploadExample from "./ImageUpload";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export interface PostDetailsType {
  title: string;
  category: string;
  coverImage: string;
  description: string;
  content: string;
  state: "DRAFT" | "PUBLISHED";
}

const postSchema = z.object({
  title: z.string().min(5, { error: "Title requires at least 5 characters." }),
  category: z.enum(postCategoryValues, {
    error: "Choose one of the supported categories.",
  }),
  coverImage: z.string().min(4, {
    error: "Cover image URL is required.",
  }),
  description: z
    .string()
    .min(15, { error: "Add a clearer short description." })
    .max(160, { error: "Keep the description concise." }),
  state: z.enum(["DRAFT", "PUBLISHED"], {
    error: "Post can only be draft or published.",
  }),
});

const UpdatePost = ({
  postDetails,
  id,
}: {
  postDetails: PostDetailsType;
  id: string;
}) => {
  const [imagePreview, setPreview] = useState(postDetails.coverImage);
  const router = useRouter();
  const { content, setContent } = usePost();

  const form = useForm<z.infer<typeof postSchema>>({
    defaultValues: {
      title: postDetails.title,
      category: postDetails.category as z.infer<typeof postSchema>["category"],
      coverImage: postDetails.coverImage,
      description: postDetails.description,
      state: postDetails.state,
    },
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    setContent(JSON.parse(postDetails.content));
  }, [postDetails.content, setContent]);

  const handleCoverUpload = (url: string) => {
    form.setValue("coverImage", url, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setPreview(url);
  };

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    const contentToSave = content ?? JSON.parse(postDetails.content);
    const updatedPost = {
      ...values,
      content: JSON.stringify(contentToSave),
    };

    try {
      await patchPost(updatedPost, id);
      toast.success("Post updated.");
      router.push(`/blog/${id}`);
    } catch (error) {
      console.log(error);
      toast.error("Post could not be updated.");
    }
  };

  const currentCover =
    useWatch({
      control: form.control,
      name: "coverImage",
    }) || imagePreview;
  const currentState = useWatch({
    control: form.control,
    name: "state",
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-border/70 bg-card/95 shadow-lg">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <Badge className="w-fit" variant="outline">
              Draft setup
            </Badge>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FilePenLine className="size-5 text-sky-500" />
              Update your story setup
            </CardTitle>
            <CardDescription>
              Refresh the headline, summary, category, and visual before you
              move through the editor canvas below.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Sharpen the headline" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Summarize the refreshed angle of the piece."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Used for cards, preview snippets, and SEO copy.</span>
                      <span>{field.value.length}/160</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {postCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 rounded-3xl border border-border/70 bg-muted/20 p-4">
              <div>
                <p className="text-sm font-medium">Cover image</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Replace the visual only if the story angle or positioning has
                  changed.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-background">
                <div className="relative aspect-[16/10]">
                  <Image
                    alt="Current cover preview"
                    className="object-cover"
                    fill
                    src={currentCover}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="coverImage"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <UploadExample
                        getImageUrl={handleCoverUpload}
                        setImageUrl={setPreview}
                        update
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card/95 shadow-xl">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <CardTitle className="text-2xl">Editor canvas</CardTitle>
            <CardDescription>
              The editor now sits in the center of the workflow with the full
              page width available for writing and revision.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <SimpleEditor updateContent={JSON.parse(postDetails.content)} />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95 shadow-lg">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <Badge className="w-fit" variant="outline">
              Publish controls
            </Badge>
            <CardTitle className="text-2xl">Finalize this update</CardTitle>
            <CardDescription>
              Choose whether the refreshed version stays private or goes live
              immediately after save.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Keep as draft</SelectItem>
                      <SelectItem value="PUBLISHED">Publish update</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm leading-6 text-muted-foreground">
              {currentState === "DRAFT" ? (
                <div className="flex items-start gap-3">
                  <Save className="mt-0.5 size-4 shrink-0 text-sky-500" />
                  <p>
                    Draft mode keeps this revision in your workspace until you
                    are satisfied with the content and metadata.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Rocket className="mt-0.5 size-4 shrink-0 text-sky-500" />
                  <p>
                    Publish mode sends the refreshed version live immediately,
                    so make sure the editor content is final.
                  </p>
                </div>
              )}
            </div>

            <Button
              className="w-full bg-sky-500 text-black hover:bg-sky-400"
              size="lg"
              type="submit"
            >
              Save changes
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default UpdatePost;
