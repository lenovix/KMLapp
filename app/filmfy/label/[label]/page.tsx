"use client";

import { useParams } from "next/navigation";
import FilmfyMetadataPage from "@/components/filmfy/metadata/MetadataPage";

export default function LabelPage() {
  const { label } = useParams<{ label: string }>();

  return <FilmfyMetadataPage type="label" value={label} title="Label" />;
}
