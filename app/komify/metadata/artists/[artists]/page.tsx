import MetadataDetailPage from "@/components/Komify/metadata/MetadataDetailPage";

export default function CharacterDetailPage() {
  return (
    <MetadataDetailPage
      field="artists"
      label="Artist"
      basePath="/komify/metadata/artists"
    />
  );
}
