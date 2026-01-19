import InfoItem from "@/components/UI/InfoItem";
import metadataCast from "@/data/filmfy/metadata-cast.json";

export default function PhysicalSection({ form, setForm }: any) {
  const physical = form.physical || {};

  const getOptions = (categoryName: string) => {
    const category = metadataCast.find(
      (item) => item.category === categoryName,
    );
    return category ? category.options : [];
  };

  const updatePhysical = (key: string, value: string) => {
    setForm({
      ...form,
      physical: {
        ...physical,
        [key]: value,
      },
    });
  };

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-gray-300 mb-4">Physical</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Measurements">
          <input
            type="text"
            className="dark-input"
            placeholder="B-W-H"
            value={physical.measurements || ""}
            onChange={(e) => updatePhysical("measurements", e.target.value)}
          />
        </InfoItem>
        <InfoItem label="Cup">
          <select
            className="dark-input scheme-dark"
            value={physical.cup || ""}
            onChange={(e) => updatePhysical("cup", e.target.value)}
          >
            <option value="">Select Cup</option>
            {getOptions("Cup Size").map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </InfoItem>
        <InfoItem label="Height">
          <input
            type="text"
            className="dark-input"
            placeholder="e.g. 160cm"
            value={physical.height || ""}
            onChange={(e) => updatePhysical("height", e.target.value)}
          />
        </InfoItem>

        <InfoItem label="Shoe Size">
          <input
            type="text"
            className="dark-input"
            value={physical.shoeSize || ""}
            onChange={(e) => updatePhysical("shoeSize", e.target.value)}
          />
        </InfoItem>

        <InfoItem label="Hair Length">
          <select
            className="dark-input scheme-dark"
            value={physical.hairLength || ""}
            onChange={(e) => updatePhysical("hairLength", e.target.value)}
          >
            <option value="">Select Length</option>
            {getOptions("Hair Length").map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </InfoItem>

        <InfoItem label="Hair Color">
          <select
            className="dark-input scheme-dark"
            value={physical.hairColor || ""}
            onChange={(e) => updatePhysical("hairColor", e.target.value)}
          >
            <option value="">Select Color</option>
            {getOptions("Hair Color").map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </InfoItem>
      </div>
    </section>
  );
}
