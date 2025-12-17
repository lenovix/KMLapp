import MetadataDetailPage from "@/components/Komify/metadata/MetadataDetailPage";

export default function ParodieDetailPage() {
  return (
    <MetadataDetailPage
      field="parodies"
      label="Parody"
      basePath="/komify/metadata/parodies"
    />
  );
}
