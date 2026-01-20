import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Library :: Komify",
  description: "Koleksi komik favorit Anda di Komify",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-zinc-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <main className="relative z-10">{children}</main>
    </div>
  );
}
