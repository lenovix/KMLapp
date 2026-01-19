import InfoItem from "@/components/UI/InfoItem";

export default function ProfileSection({ form, setForm }: any) {
  const profile = form.profile || {};

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-gray-300 mb-4">Profile</h2>

      <InfoItem label="Hobbies">
        <textarea
          rows={2}
          className="dark-input resize-none"
          value={profile.hobbies || ""}
          onChange={(e) =>
            setForm({
              ...form,
              profile: { ...profile, hobbies: e.target.value },
            })
          }
        />
      </InfoItem>

      <InfoItem label="Special Skills">
        <textarea
          rows={2}
          className="dark-input resize-none"
          value={profile.specialSkills || ""}
          onChange={(e) =>
            setForm({
              ...form,
              profile: {
                ...profile,
                specialSkills: e.target.value,
              },
            })
          }
        />
      </InfoItem>

      <InfoItem label="Deskripsi">
        <textarea
          rows={4}
          className="dark-input resize-none"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </InfoItem>
    </section>
  );
}
