import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Center :: K.Platform",
  description: "Support Center for K.Platform App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {children}
    </div>
  );
}
