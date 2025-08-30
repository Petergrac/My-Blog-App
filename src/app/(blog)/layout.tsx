import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Ojuju } from "next/font/google";
import "../globals.css";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});
const ojuju = Ojuju({
  variable: "--font-ojuju",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bloog",
  description: "Read Write and Share all sorts of blogs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <main
            className={`${geistSans.variable} ${ojuju.variable} ${lora.variable} ${geistMono.variable} antialiased`}
          >
              <HeroSection />
              {children}
              <Footer />
          </main>
  );
}
