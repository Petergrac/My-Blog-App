// src/app/user-profile/user-data/Bio.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea"; // Assuming you use Shadcn UI
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveUserData } from "@/lib/_roleUpdate"; // Your server action for saving data

// Sample list of countries
const countries = [
  "United States",
  "China",
  "Kenya",
  "India",
  "Brazil",
  "Russia",
  "United Kingdom",
  "France",
  "Germany",
  "Japan",
  "Canada",
  "Australia",
  "Mexico",
  "Italy",
  "Spain",
  "South Korea",
  "Indonesia",
  "Saudi Arabia",
  "Turkey",
  "Iran",
  "Pakistan",
  "Nigeria",
  "Egypt",
  "Bangladesh",
  "Vietnam",
  "Philippines",
];

const Bio = () => {
  const { user, isLoaded } = useUser();
  const [bio, setBio] = useState(
    (user?.publicMetadata.bio as string) || ""
  );
  const [country, setCountry] = useState(
    (user?.publicMetadata.country as string) || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // If user data is not loaded yet, display a loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleSave = async () => {
    setIsUpdating(true);
    toast.info("Updating your profile...", { id: "profile-update" });

    // Call the server action to save the data
    const response = await saveUserData({ bio, country });

    if (response?.message) {
      // Reload user to get the updated metadata from Clerk
      await user?.reload();
      toast.success(response.message, { id: "profile-update" });
    } else {
      toast.error(response?.error || "Failed to save data.", {
        id: "profile-update",
      });
    }

    setIsUpdating(false);
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto transform transition-all duration-300 hover:shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Personal Information</h1>
      <p className="text-gray-600 mb-6">
        Tell us a bit about yourself and where you&apos;re from.
      </p>

      <div className="space-y-6">
        {/* Country Select Field */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Country</label>
          <Select onValueChange={setCountry} value={country}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent className="h-1/2">
              {countries.sort().map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bio Textarea */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Bio</label>
          <Textarea
            placeholder="Write a short bio about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default Bio;