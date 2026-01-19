import InfoItem from "@/components/UI/InfoItem";

export default function DebutSection({ form, setForm }: any) {
  const debut = form.debut || {};

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-gray-300 mb-4">Debut</h2>

      <InfoItem label="Alasan Debut">
        <textarea
          rows={2}
          className="dark-input resize-none"
          value={debut.reason || ""}
          onChange={(e) =>
            setForm({
              ...form,
              debut: { ...debut, reason: e.target.value },
            })
          }
        />
      </InfoItem>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Debut Mulai">
          <input
            className="dark-input"
            value={debut.start || ""}
            onChange={(e) =>
              setForm({
                ...form,
                debut: { ...debut, start: e.target.value },
              })
            }
          />
        </InfoItem>

        <InfoItem label="Debut Selesai">
          <input
            className="dark-input"
            value={debut.end || ""}
            onChange={(e) =>
              setForm({
                ...form,
                debut: { ...debut, end: e.target.value },
              })
            }
          />
        </InfoItem>
      </div>
    </section>
  );
}
