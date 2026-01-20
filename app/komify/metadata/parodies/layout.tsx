import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parodies — Komify",
  description: "Browse comics by parody collection on Komify",
};

export default function ParodiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="flex-1 w-full transition-all duration-500">
        {children}
      </main>
    </div>
  );
}
