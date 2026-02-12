import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "K.Platform",
  description: "K.Platform is SuperAPP for Storage, Comics, Films, Anime",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
