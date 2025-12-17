import MetadataListPage from "@/components/Komify/metadata/MetadataListPage";

export default function authorsPage() {
  return (
    <MetadataListPage
      field="authors"
      title="Author"
      basePath="/komify/metadata/author"
    />
  );
}
