import MetadataListPage from "@/components/Komify/metadata/MetadataListPage";

export default function groupsPage() {
  return (
    <MetadataListPage
      field="groups"
      title="Groups"
      basePath="/komify/metadata/groups"
    />
  );
}
