"use client";

import UserRole from "@/components/UserRole";
import { UserProfile } from "@clerk/nextjs";
import { Briefcase } from "lucide-react";

const UserProfilePage = () => (
  <div className="flex flex-1 justify-center items-center h-screen">
    <UserProfile path="/user-profile" routing="path">
      {/* You can pass the content as a component */}
      <UserProfile.Page
        label="Role"
        labelIcon={<Briefcase width={15} className="text-gray-500" />}
        url="change-role"
      >
        <UserRole />
      </UserProfile.Page>
    </UserProfile>
  </div>
);

export default UserProfilePage;
