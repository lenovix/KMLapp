import MetadataListPage from "@/components/Komify/metadata/MetadataListPage";

export default function ParodiesPage() {
  return (
    <MetadataListPage
      field="parodies"
      title="Parodies"
      basePath="/komify/metadata/parodies"
    />
  );
}
