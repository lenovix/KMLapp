import Header from "@/components/Komify/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komify :: Manga, Manhwa, Doujin",
  description: "Komify is Comics Collection",
};

export default function ComicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header/>

      {/* Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
