// app/contact/page.tsx (or wherever your route is)

"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your request has been sent!");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Contact Us</CardTitle>
          <p className="text-muted-foreground text-sm">
            Have any questions or feedback? We&apos;d love to hear from you.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="py-1">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="py-1">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject" className="py-1">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Subject of your message"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="message" className="py-1">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Write your message here..."
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Optional: Add your contact info below */}
      <div className="mt-12 text-center text-muted-foreground text-sm">
        <p>
          Email us directly at:{" "}
          <span className="font-medium">bloog-support@gmail.com</span>
        </p>
        <p>
          Follow us on Twitter:{" "}
          <a
            href="https://twitter.com/yourhandle"
            className="text-primary underline"
          >
            @apostle254
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
