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
    <html lang="en" suppressHydrationWarning>
      <body className="" suppressHydrationWarning>
        <div className="">{children}</div>
      </body>
    </html>
  );
}
