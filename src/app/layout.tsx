// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./context/ThemeContext";
import AssistantWidget from "@/app/components/AssistantWidget";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CharlesTech - Portfolio",
  description: "Fullstack Software Developer Portfolio Software Engineer | Full Stack Developer | Mobile App Developer | n8n AI Automations | Database Management | API Optimization | UI/UX Enthusiast | Open Source Contributor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen pt-24">{children}</main>
            <Footer />
            <AssistantWidget />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
