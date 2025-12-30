"use client";

import { useParams } from "next/navigation";
import FilmfyMetadataPage from "@/components/filmfy/metadata/MetadataPage";

export default function MakerPage() {
  const { maker } = useParams<{ maker: string }>();

  return <FilmfyMetadataPage type="maker" value={maker} title="Maker" />;
}
