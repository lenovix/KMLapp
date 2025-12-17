import MetadataDetailPage from "@/components/Komify/metadata/MetadataDetailPage";

export default function authorsDetailPage() {
  return (
    <MetadataDetailPage
      field="authors"
      label="Author"
      basePath="/komify/metadata/author"
    />
  );
}
