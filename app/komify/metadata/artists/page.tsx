import MetadataListPage from "@/components/Komify/metadata/MetadataListPage";

export default function CharactersPage() {
  return (
    <MetadataListPage
      field="artists"
      title="Artists"
      basePath="/komify/metadata/artists"
    />
  );
}
