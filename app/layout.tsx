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
      <body>{children}</body>
    </html>
  );
}
