import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AGENTS.md Generator — AI-Powered Agent Instructions for GitHub Repos",
  description:
    "Generate comprehensive AGENTS.md files for any public GitHub repository. Powered by Gemini 2.5 Flash to analyze your codebase and create tailored AI agent instructions.",
  keywords: ["agents.md", "github", "ai", "gemini", "code generation", "developer tools"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
