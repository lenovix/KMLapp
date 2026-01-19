import InfoItem from "@/components/UI/InfoItem";

export default function SocialMediaSection({ form, setForm }: any) {
  const social = form.socialMedia || {};

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-gray-300 mb-4">Social Media</h2>

      <InfoItem label="Instagram">
        <input
          className="dark-input"
          value={social.instagram || ""}
          onChange={(e) =>
            setForm({
              ...form,
              socialMedia: { ...social, instagram: e.target.value },
            })
          }
        />
      </InfoItem>

      <InfoItem label="Twitter / X">
        <input
          className="dark-input"
          value={social.twitter || ""}
          onChange={(e) =>
            setForm({
              ...form,
              socialMedia: { ...social, twitter: e.target.value },
            })
          }
        />
      </InfoItem>

      <InfoItem label="TikTok">
        <input
          className="dark-input"
          value={social.tiktok || ""}
          onChange={(e) =>
            setForm({
              ...form,
              socialMedia: { ...social, tiktok: e.target.value },
            })
          }
        />
      </InfoItem>

      <InfoItem label="YouTube">
        <input
          className="dark-input"
          value={social.youtube || ""}
          onChange={(e) =>
            setForm({
              ...form,
              socialMedia: { ...social, youtube: e.target.value },
            })
          }
        />
      </InfoItem>
    </section>
  );
}
