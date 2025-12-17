import MetadataListPage from "@/components/Komify/metadata/MetadataListPage";

export default function tagsPage() {
  return (
    <MetadataListPage
      field="tags"
      title="Tags"
      basePath="/komify/metadata/tags"
    />
  );
}
