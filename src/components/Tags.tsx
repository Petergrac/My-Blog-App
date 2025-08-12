"use client";

import { Tags } from "./data/tags";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useEditorStore } from "@/store/editStore";
import { ScrollArea } from "./ui/scroll-area";

const FormSchema = z.object({
  Tags: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export default function TagsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Tags: ["seo", "frontend", "cms"],
    },
  });
  
  // States & stores
  const setData = useEditorStore((state) => state.setData);
  const [toggleMode, setToggleMode] = useState(false);
  
  // Submit Handler
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  setData(data);
  }

  return (
    <Collapsible>
      <Form {...form}>
        <div className="mb-4 mt-2">
          <h1 className="text-base font-medium">
            <span className="text-muted-foreground">Step 2:</span> Add Tags (Make sure you press submit) <span className="text-red-500"> *</span>
          </h1>
          <CollapsibleTrigger>
            <FormLabel
              onClick={() => setToggleMode((prev) => !prev)}
              className="text-base mt-4 bg-muted p-1 rounded-sm"
            >
              Tags {toggleMode ? <ChevronUp /> : <ChevronDown />}
            </FormLabel>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="Tags"
              render={() => (
                <FormItem>
                  <FormDescription>
                    Select the tags you want to display in the sidebar.
                  </FormDescription>
                  <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                    {Tags.map((tag) => (
                    <FormField
                      key={tag.id}
                      control={form.control}
                      name="Tags"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={tag.id}
                            className="flex flex-row tags-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, tag.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== tag.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {tag.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </ScrollArea>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </CollapsibleContent>
      </Form>
    </Collapsible>
  );
}
