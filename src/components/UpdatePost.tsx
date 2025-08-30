"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import Image from "next/image";
import UploadExample from "./ImageUpload";
import { usePost } from "@/store/EditorStore";
import { Button } from "./ui/button";
import { patchPost } from "@/actions/PostActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface PostDetailsType {
  title: string;
  category: string;
  coverImage: string;
  description: string;
  content: string;
  state: "DRAFT" | "PUBLISHED";
}

const categories: string[] = [
  "frontend",
  "backend",
  "devops",
  "data structures",
  "data science",
  "testing",
  "system design",
];

// Basic zod schema
const postSchema = z.object({
  title: z.string().min(5, { error: "Title requires at-least 5 characters" }),
  category: z.enum(categories, { error: "You must choose the given category" }),
  coverImage: z.string().min(4, {
    error: "Cover image url is needed. Make sure the image was uploaded",
  }),
  description: z
    .string()
    .min(15, { error: "A short description about this post is needed" })
    .max(100, { error: "That description is too long." }),
  state: z.enum(["DRAFT", "PUBLISHED"], {
    error: "Post can only be either draft or published",
  }),
});

const UpdatePost = ({
  postDetails,
  id,
}: {
  postDetails: PostDetailsType;
  id: string;
}) => {
  // Cover image preview
  const [imagePreview, setPreview] = useState(postDetails.coverImage);
  const router = useRouter();
  const { coverImage, content, setContent } = usePost();
  // React hook form to attach zod
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: postDetails.title,
      category: postDetails.category,
      coverImage: postDetails.coverImage,
      description: postDetails.description,
      state: postDetails.state,
    },
  });

  // handle image upload
  const handleCoverUpload = (url: string) => {
    form.setValue("coverImage", url, { shouldValidate: true });
    URL.revokeObjectURL(imagePreview);
  };

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    if (!content) {
      setContent(JSON.parse(postDetails.content));
    }
    // Stringify the content
    const newContent = JSON.stringify(content);
    // Create the final post object
    const updatedPost = { content: newContent, ...values };
    try {
      // Call post action
      await patchPost(updatedPost, id);
      toast.success("Post updated");
      router.push(`/blog/${id}`);
    } catch (error) {
      toast.error("Post could not be updated");
      throw error;
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 2xl:mx-10 4xl:mx-20 6xl:mx-40 mt-10 ring mx-2 rounded-sm py-5 ring-muted"
      >
        <div className=" flex sm:flex-row flex-1 flex-col justify-between">
          <div className="border-r  pr-2 flex-1 gap-5 flex flex-col px-5">
            {/* TITLE */}
            <p className="border-b font-bold text-amber-600 text-2xl tracking-wider">
              Part 1
            </p>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a compelling title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Enter the post description"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1 border-r w-full  pr-2 justify-center items-center gap-8 flex flex-col px-5">
            <p className="border-b font-bold text-amber-600 text-2xl tracking-wider">
              Part 2
            </p>
            {/* COVER-IMAGE */}
            <FormField
              control={form.control}
              name="coverImage"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">
                    Upload your cover Image
                  </FormLabel>
                  <FormControl>
                    <div className="">
                      {coverImage ? (
                        <div className="">
                          <p className="text-xs text-sky-500 py-2">
                            Your new cover image
                          </p>
                          <Image
                            src={coverImage || imagePreview}
                            alt=""
                            width={100}
                            height={100}
                          />
                        </div>
                      ) : (
                        imagePreview && (
                          <div className="">
                            <p className="text-xs py-2 text-slate-500">
                              Previous cover image
                            </p>
                            <Image
                              src={imagePreview}
                              alt=""
                              width={100}
                              height={100}
                              className="aspect-video"
                            />
                          </div>
                        )
                      )}
                      <FormLabel
                        htmlFor="image"
                        className="flex flex-col gap-2 w-fit my-2 text-sm"
                      >
                        <span className="ring-[1px] p-[3px] text-xs rounded-sm">
                          Choose an Image
                        </span>
                      </FormLabel>
                      <UploadExample
                        getImageUrl={handleCoverUpload}
                        update={true}
                        setImageUrl={setPreview}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CATEGORY */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select one category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-center flex-col gap-4">
          <p className="border-b font-bold text-amber-600 text-2xl tracking-wider">
            Part 3
          </p>
          <p className="text-center w-fit">
            This is the final section, that is after you have modified
            <br />
            everything including the content.
            <br /> Click this button to update your post in the database.
          </p>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdatePost;
