import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload :: Komify",
  description: "Upload and manage your comic collections",
};

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" text-zinc-100 ">
      <main className="relative z-10 mx-auto ">{children}</main>
    </div>
  );
}
