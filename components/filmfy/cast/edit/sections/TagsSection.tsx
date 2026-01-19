import InfoItem from "@/components/UI/InfoItem";

export default function TagsSection({ form, setForm }: any) {
  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-gray-300 mb-4">Tags</h2>

      <InfoItem label="Tags (comma separated)">
        <input
          className="dark-input"
          placeholder="actor, model, content creator"
          value={(form.tags || []).join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />
      </InfoItem>
    </section>
  );
}
