import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authors :: Komify",
  description: "Komify is Comics Collection",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <main className="flex-1 w-full transition-all duration-500">
        {children}
      </main>
    </div>
  );
}
