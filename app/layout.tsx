import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KMLapp",
  description: "KMLapp is SuperAPP for Storage, Comics, Films, Anime",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <div className="flex flex-col bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
          {children}
        </div>
      </body>
    </html>
  );
}
