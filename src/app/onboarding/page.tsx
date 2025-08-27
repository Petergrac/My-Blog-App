"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Book, UserIcon } from "lucide-react";

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const [membershipType, setMembershipType] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData);
    if (res?.message) {
      await user?.reload();
      router.push("/");
    }
    if (res?.error) {
      setError(res?.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Our Community!</h1>
          <p className="text-gray-600">
            Let&apos;s get you set up. Please choose a membership type to
            continue.
          </p>
        </div>
        <Image
          src={`/onboarding.png`}
          className="mx-auto"
          alt="onboarding"
          width={350}
          height={200}
        />
        <form action={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  {membershipType
                    ? `Selected: ${membershipType}`
                    : "Choose Membership Type"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuLabel className="font-bold">
                  What&apos;s Your Role?
                </DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setMembershipType("User")}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium flex gap-2 items-center text-fuchsia-500">
                      <UserIcon className="text-gray-500" /> User
                    </span>
                    <span className="text-sm text-gray-500">
                      Access and view content created by authors.
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setMembershipType("Author")}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-cyan-500 flex items-center gap-2">
                      <Book className="text-gray" /> Author
                    </span>
                    <span className="text-sm text-gray-500">
                      Create, publish, and manage your own content.
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input type="hidden" name="membershipType" value={membershipType} />
          </div>
          {error && <p className="text-red-600 text-center">{error}</p>}
          
          <Button type="submit" className="w-full">
            Complete Onboarding
          </Button>
        </form>
      </div>
    </div>
  );
}
