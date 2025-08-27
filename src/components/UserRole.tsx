"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming you have these Shadcn UI components
import { toast } from "sonner"; // For nice notifications
import changeRole from "@/lib/_roleUpdate";
import { ChevronDownIcon, CheckIcon, UserIcon, PencilLine } from "lucide-react"; // Icons for a richer UI

const UserRole = () => {
  const { user, isLoaded } = useUser();
  // Initialize with current role or a default, ensure it's a string
  const [selectedRole, setSelectedRole] = useState<string>('User');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Update selectedRole state when user data loads or changes
  useEffect(() => {
    if (isLoaded && user) {
      // Ensure the role from metadata is always a string, default to 'User'
      setSelectedRole((user.publicMetadata.role as string) || 'User');
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    // Show a skeleton or loading spinner while user data is loading
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-sm mx-auto animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  const currentRole = (user?.publicMetadata.role as string) || 'User';

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) {
      toast.info("You are already a " + newRole + ".");
      return;
    }

    setIsUpdating(true);
    toast.info("Updating your role...", { id: 'role-update' });

    const response = await changeRole(newRole);

    if (response?.message) {
      await user?.reload(); // Reload user to get fresh metadata
      setSelectedRole(newRole); // Update local state immediately
      toast.success(response.message, { id: 'role-update' });
    } else if (response?.error) {
      toast.error(response.error, { id: 'role-update' });
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col text-gray-800 items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-sm mx-auto transform transition-all duration-300 hover:shadow-lg">
      <UserIcon className="text-blue-600 w-12 h-12 mb-4 animate-bounce-slow" /> {/* Larger, animated icon */}
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-gray-900">
        Role Management
      </h1>
      <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
        Your current access level:{" "}
        <span className="font-bold text-blue-700 text-lg tracking-wide capitalize">
          {currentRole}
        </span>
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <span className="flex items-center">
              <PencilLine className="w-4 h-4 mr-2 animate-spin" /> Updating...
            </span>
          ) : (
            <>
              <span className="font-medium text-base">Change Role ({selectedRole})</span>
              <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg rounded-lg border border-gray-200 mt-2">
          <DropdownMenuItem
            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150 rounded-md"
            onClick={() => handleRoleChange("Author")}
            disabled={isUpdating}
          >
            Author {currentRole === "Author" && <CheckIcon className="w-4 h-4 text-blue-600" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150 rounded-md"
            onClick={() => handleRoleChange("User")}
            disabled={isUpdating}
          >
            User {currentRole === "User" && <CheckIcon className="w-4 h-4 text-blue-600" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserRole;