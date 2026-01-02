import MetadataList from "@/components/filmfy/metadata/MetadataList";

export default function DirectorPage() {
  return (
    <MetadataList title="Maker" field="maker" linkPrefix="/filmfy/maker" />
  );
}
