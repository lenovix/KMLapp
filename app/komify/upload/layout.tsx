import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload :: Komify",
  description: "Komify is Comics Collection",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="">
        {children}
      </main>
    </div>
  );
}
