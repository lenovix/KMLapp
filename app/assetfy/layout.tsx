import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assetfy",
  description: "Assetfy for Asset Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="" suppressHydrationWarning>
        <div className="">{children}</div>
      </body>
    </html>
  );
}
