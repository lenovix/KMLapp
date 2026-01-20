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
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 w-full  ">{children}</main>

      <footer className="relative z-10 border-t border-zinc-800/50 py-8 text-center text-xs text-zinc-500">
        <p>© Dec 2025 Komify Project</p>
      </footer>
    </div>
  );
}
