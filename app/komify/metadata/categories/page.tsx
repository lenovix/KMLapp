import MetadataListPage from "@/components/Komify/metadata/MetadataListPage";

export default function categoriesPage() {
  return (
    <MetadataListPage
      field="categories"
      title="Categories"
      basePath="/komify/metadata/categories"
    />
  );
}
