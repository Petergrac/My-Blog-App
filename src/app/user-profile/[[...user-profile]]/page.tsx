"use client";

import Bio from "@/components/UserBio";
import UserRole from "@/components/UserRole";
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeft, Briefcase, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserProfilePage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 justify-center items-center h-screen">
      <Link
        onClick={() => router.replace("/")}
        href="/"
        className="text-sm flex gap-2 items-center py-5 hover:underline anim"
      >
        <ArrowLeft />
        Back to Homepage
      </Link>
      <UserProfile path="/user-profile" routing="path">
        {/* You can pass the content as a component */}
        <UserProfile.Page
          label="Role"
          labelIcon={<Briefcase width={15} className="text-gray-500 h-full" />}
          url="change-role"
        >
          <UserRole />
        </UserProfile.Page>
        <UserProfile.Page
          label="Country & Bio"
          labelIcon={<Info className="h-full" width={15} />}
          url="user-data"
        >
          <Bio />
        </UserProfile.Page>
      </UserProfile>
    </div>
  );
};

export default UserProfilePage;
