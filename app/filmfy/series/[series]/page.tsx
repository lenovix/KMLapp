"use client";

import { useParams } from "next/navigation";
import FilmfyMetadataPage from "@/components/filmfy/metadata/MetadataPage";

export default function SeriesPage() {
  const { series } = useParams<{ series: string }>();

  return <FilmfyMetadataPage type="series" value={series} title="Series" />;
}
