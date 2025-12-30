"use client";

import { useParams } from "next/navigation";
import FilmfyMetadataPage from "@/components/filmfy/metadata/MetadataPage";

export default function DirectorPage() {
  const { director } = useParams<{ director: string }>();

  return (
    <FilmfyMetadataPage type="director" value={director} title="Director" />
  );
}
