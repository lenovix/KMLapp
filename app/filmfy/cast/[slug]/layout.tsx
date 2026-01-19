import type { Metadata } from "next";
import fs from "fs";
import path from "path";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const CAST_JSON = path.join(process.cwd(), "data", "filmfy", "casts.json");

  try {
    const raw = fs.readFileSync(CAST_JSON, "utf-8");
    const casts = JSON.parse(raw);
    const cast = casts.find((c: any) => c.slug === slug);
    const title = cast ? `${cast.name} :: Filmfy` : "Cast Not Found :: Filmfy";

    return {
      title: title,
      description: cast?.description || "Filmfy is Movies Collection",
    };
  } catch (error) {
    return {
      title: "Cast :: Filmfy",
    };
  }
}

export default function KomicfyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="">{children}</main>
    </div>
  );
}
