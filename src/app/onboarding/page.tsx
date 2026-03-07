"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  ChevronRight,
  PenLine,
  Sparkles,
  User2,
} from "lucide-react";

import { completeOnboarding } from "./_actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MembershipType = "User" | "Author" | "";

interface RoleOption {
  id: MembershipType;
  icon: React.ReactNode;
  label: string;
  tagline: string;
  perks: string[];
  color: string;
  badge: string;
}

const ROLES: RoleOption[] = [
  {
    id: "User",
    icon: <User2 className="h-7 w-7" />,
    label: "Reader",
    tagline: "Explore, discover, and engage",
    perks: [
      "Unlimited access to all articles",
      "Save posts to your reading list",
      "Comment and react to posts",
      "Follow your favourite authors",
    ],
    color:
      "border-fuchsia-500/40 bg-fuchsia-500/5 hover:border-fuchsia-500/80 hover:bg-fuchsia-500/10",
    badge: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20",
  },
  {
    id: "Author",
    icon: <PenLine className="h-7 w-7" />,
    label: "Author",
    tagline: "Write, publish, and grow",
    perks: [
      "Create and publish articles",
      "Manage your personal blog",
      "Access author analytics",
      "Build your audience",
    ],
    color:
      "border-sky-500/40 bg-sky-500/5 hover:border-sky-500/80 hover:bg-sky-500/10",
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  },
];

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const [membershipType, setMembershipType] =
    React.useState<MembershipType>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useUser();
  const router = useRouter();

  const firstName = user?.firstName ?? "there";

  const handleSubmit = async (formData: FormData) => {
    if (!membershipType) {
      setError("Please choose a role to continue.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const res = await completeOnboarding(formData);

    if (res?.message) {
      await user?.reload();
      router.push("/");
      return;
    }

    if (res?.error) {
      setError(res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center space-y-3 mb-10 max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl font-bold font-sans">
            <span className="text-sky-500">Blo</span>
            <span className="text-yellow-400">og</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground mb-2">
          <Sparkles className="h-3 w-3 text-yellow-400" />
          One last step
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground text-base max-w-sm mx-auto">
          Choose how you&apos;d like to use Bloog. You can always change this
          later from your profile settings.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {ROLES.map((role) => {
          const isSelected = membershipType === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => {
                setMembershipType(role.id);
                setError("");
              }}
              className={cn(
                "relative text-left rounded-2xl border-2 p-6 transition-all duration-200 outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                role.color,
                isSelected && "ring-2 ring-offset-2 ring-offset-background",
                isSelected && role.id === "User" && "ring-fuchsia-500",
                isSelected && role.id === "Author" && "ring-sky-500",
              )}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <span className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-3 w-3" />
                </span>
              )}

              {/* Icon + label */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl border",
                    role.id === "User"
                      ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400"
                      : "border-sky-500/30 bg-sky-500/10 text-sky-400",
                  )}
                >
                  {role.icon}
                </span>
                <div>
                  <div className="font-semibold text-foreground text-lg leading-tight">
                    {role.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {role.tagline}
                  </div>
                </div>
              </div>

              {/* Perks list */}
              <ul className="space-y-2 mt-4">
                {role.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 mt-0.5 shrink-0",
                        role.id === "User"
                          ? "text-fuchsia-400"
                          : "text-sky-400",
                      )}
                    />
                    {perk}
                  </li>
                ))}
              </ul>

              {/* Badge */}
              <div className="mt-4">
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium", role.badge)}
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {role.id === "User" ? "Free forever" : "Free to start"}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info card */}
      <Card className="w-full max-w-2xl border-border bg-muted/40 mb-8">
        <CardContent className="flex items-start gap-3 pt-5 pb-5">
          <Sparkles className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Not sure which to pick?
            </span>{" "}
            Start as a Reader — you can upgrade to Author any time from your
            profile settings once you&apos;re ready to start writing.
          </p>
        </CardContent>
      </Card>

      {/* Submit form */}
      <form action={handleSubmit} className="w-full max-w-2xl space-y-3">
        <input type="hidden" name="membershipType" value={membershipType} />

        {error && (
          <p className="text-sm text-destructive text-center rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !membershipType}
          className="w-full rounded-full h-12 text-base font-semibold gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Setting up your account...
            </>
          ) : (
            <>
              Continue as {membershipType || "..."}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
