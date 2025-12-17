import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload :: Filmfy",
  description: "Filmfy is Comics Collection",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
