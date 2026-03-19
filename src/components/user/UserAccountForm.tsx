"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AtSign, IdCard, UserRound } from "lucide-react";

import { updateAccountDetails } from "@/lib/_roleUpdate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getDisplayName = (firstName?: string | null, lastName?: string | null) =>
  [firstName, lastName].filter(Boolean).join(" ").trim();
function AccountFormInner({
  initialUsername,
  initialFirstName,
  initialLastName,
  email,
}: {
  initialUsername: string;
  initialFirstName: string;
  initialLastName: string;
  email?: string | null;
}) {
  const { update } = useSession();
  const [username, setUsername] = useState(initialUsername);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    toast.info("Updating your account...", { id: "account-update" });

    const response = await updateAccountDetails({
      username,
      firstName,
      lastName,
    });

    if (response?.message) {
      await update({ user: { username, firstName, lastName } });
      toast.success(response.message, { id: "account-update" });
    } else {
      toast.error(response?.error || "Could not update your account.", {
        id: "account-update",
      });
    }

    setIsSaving(false);
  };

  const displayName = getDisplayName(firstName, lastName);

  return (
    <Card className="border-border/70 bg-card/95 shadow-lg">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-muted/60">
            <UserRound className="h-5 w-5 text-muted-foreground" />
          </span>
          <div>
            <CardTitle className="text-xl">Profile details</CardTitle>
            <CardDescription>
              Update how your name appears across Bloog.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
          <p className="text-muted-foreground">Preview name</p>
          <p className="font-semibold text-foreground">
            {displayName || username || email || "Bloog member"}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              First name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSaving}
              placeholder="Jane"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              Last name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSaving}
              placeholder="Doe"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <AtSign className="h-4 w-4 text-muted-foreground" />
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSaving}
            placeholder="janedoe"
          />
          <p className="text-xs text-muted-foreground">
            Usernames are 3 to 24 characters and can include letters, numbers,
            and underscores.
          </p>
        </div>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
export default function UserAccountForm() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card className="border-border/70 bg-card/95 shadow-lg">
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) return null;

  return (
    <AccountFormInner
      key={session.user.id} // remounts if user changes
      initialUsername={session.user.username ?? ""}
      initialFirstName={session.user.firstName ?? ""}
      initialLastName={session.user.lastName ?? ""}
      email={session.user.email}
    />
  );
}
