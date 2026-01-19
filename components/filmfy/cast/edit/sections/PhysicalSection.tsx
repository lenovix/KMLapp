import InfoItem from "@/components/UI/InfoItem";

export default function PhysicalSection({ form, setForm }: any) {
  const physical = form.physical || {};

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-gray-300 mb-4">Physical</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Height">
          <input
            className="dark-input"
            value={physical.height || ""}
            onChange={(e) =>
              setForm({
                ...form,
                physical: { ...physical, height: e.target.value },
              })
            }
          />
        </InfoItem>

        <InfoItem label="Measurements">
          <input
            className="dark-input"
            value={physical.measurements || ""}
            onChange={(e) =>
              setForm({
                ...form,
                physical: {
                  ...physical,
                  measurements: e.target.value,
                },
              })
            }
          />
        </InfoItem>

        <InfoItem label="Cup">
          <input
            className="dark-input"
            value={physical.cup || ""}
            onChange={(e) =>
              setForm({
                ...form,
                physical: { ...physical, cup: e.target.value },
              })
            }
          />
        </InfoItem>

        <InfoItem label="Shoe Size">
          <input
            className="dark-input"
            value={physical.shoeSize || ""}
            onChange={(e) =>
              setForm({
                ...form,
                physical: {
                  ...physical,
                  shoeSize: e.target.value,
                },
              })
            }
          />
        </InfoItem>

        <InfoItem label="Hair Length">
          <input
            className="dark-input"
            value={physical.hairLength || ""}
            onChange={(e) =>
              setForm({
                ...form,
                physical: {
                  ...physical,
                  hairLength: e.target.value,
                },
              })
            }
          />
        </InfoItem>

        <InfoItem label="Hair Color">
          <input
            className="dark-input"
            value={physical.hairColor || ""}
            onChange={(e) =>
              setForm({
                ...form,
                physical: {
                  ...physical,
                  hairColor: e.target.value,
                },
              })
            }
          />
        </InfoItem>
      </div>
    </section>
  );
}
