import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peoplefy :: Peoplefy is Data Someone",
  description: "Peoplefy is Data Someone",
};

export default function PeoplefyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <main className="">
        {children}
      </main>
    </div>
  );
}
