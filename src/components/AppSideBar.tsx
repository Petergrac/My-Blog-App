import {
  ClipboardCheck,
  Home,
  MessageCircle,
  Pencil,
  Search,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { SignedIn, UserButton } from "@clerk/nextjs";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "NewBlog",
    url: "/new",
    icon: Pencil,
  },
  {
    title: "Posts",
    url: "/posts/6235",
    icon: ClipboardCheck,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Comments",
    url: "/comments",
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5 mt-2 font-bold text-lg text-sky-500">
            Bl<span className="text-amber-400">oo</span>g
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Posts" && (
                    <SidebarMenuBadge>13</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
       <SignedIn>
        <UserButton />
       </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
