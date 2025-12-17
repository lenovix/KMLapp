import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character :: Komify",
  description: "Komify is Comics Collection",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="">
        {children}
      </main>
    </div>
  );
}
