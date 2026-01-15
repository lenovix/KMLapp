import MovieForm from "@/components/filmfy/MovieForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getFilmById(id: string) {
  const res = await fetch("http://localhost:3000/api/filmfy/films", {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const films = await res.json();
  return films.find((f: any) => f.id === Number(id)) ?? null;
}

export default async function EditMoviePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) notFound();

  const film = await getFilmById(id);
  if (!film) notFound();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
      <MovieForm mode="edit" initialData={film} />
    </main>
  );
}
