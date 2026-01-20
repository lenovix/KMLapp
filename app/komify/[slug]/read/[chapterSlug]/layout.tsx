import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Chapter | Komify",
  description:
    "Enjoy your favorite comics with the best reading experience on Komify.",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      <main className="flex-1 w-full flex flex-col relative">{children}</main>
    </div>
  );
}
