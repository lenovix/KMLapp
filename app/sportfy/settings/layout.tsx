import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings :: Sportfy",
  description: "Sportfy is Workout Timeline",
};

export default function SportfyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="">{children}</main>
    </div>
  );
}
