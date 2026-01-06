import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komify :: Manga, Manhwa, Doujin",
  description: "Komify is Comics Collection",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
