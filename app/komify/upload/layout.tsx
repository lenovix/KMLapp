import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload :: Komify",
  description: "Upload and manage your comic collections",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-zinc-100 ">
      <main className="relative z-10 container mx-auto px-4 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
