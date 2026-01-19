import CastEditForm from "@/components/filmfy/cast/edit/CastEditForm";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CastEditPage({ params }: Props) {
  const { slug } = await params;

  const FILE = path.join(process.cwd(), "data", "filmfy", "casts.json");

  const casts = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  const cast = casts.find((c: any) => c.slug === slug);

  if (!cast) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-100 mb-6">
        Edit Cast — {cast.name}
      </h1>

      <CastEditForm initialData={cast} />
    </div>
  );
}
