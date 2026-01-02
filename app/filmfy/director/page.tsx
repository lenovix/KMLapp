import MetadataList from "@/components/filmfy/metadata/MetadataList";

export default function DirectorPage() {
  return (
    <MetadataList
      title="Director"
      field="director"
      linkPrefix="/filmfy/director"
    />
  );
}
