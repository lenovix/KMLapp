import MetadataListPage from "@/components/Komify/metadata/MetadataListPage";

export default function CharactersPage() {
  return (
    <MetadataListPage
      field="characters"
      title="Characters"
      basePath="/komify/metadata/characters"
    />
  );
}
