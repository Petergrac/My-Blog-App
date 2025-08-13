import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import NavBar from "@/components/NavBar";
import { SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";
import { Toaster } from "sonner";
import {
  ClerkProvider,
} from '@clerk/nextjs'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TomCat Editor",
  description:
    "Share your knowledge by writing high quality customizable blog posts about the latest technology.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <ClerkProvider>
    <html lang="en" data-scroll-behavior='smooth' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} w-full ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="">
              <div className="flex items-center w-screen md:w-[95vw] sticky top-0 z-40 bg-background">
                <NavBar />
              </div>
              {children}
              <Toaster richColors position="top-center" duration={700}/>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
