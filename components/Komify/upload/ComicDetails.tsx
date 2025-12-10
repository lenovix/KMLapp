import InputText from "@/components/UI/InputText";

interface ComicData {
  title: string;
  parodies: Array<string>;
  characters: Array<string>;
  tags: Array<string>;
  artist: Array<string>;
  groups: Array<string>;
  author: Array<string>;
  categories: Array<string>;
}

interface ComicDetailsProps {
  comicData: ComicData;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ComicDetails({
  comicData,
  onChange,
}: ComicDetailsProps) {
  const fields = [
    { name: "title", placeholder: "Title" },
    { name: "parodies", placeholder: "Parodies" },
    { name: "characters", placeholder: "Characters" },
    { name: "tags", placeholder: "Tags" },
    { name: "artist", placeholder: "Artist" },
    { name: "groups", placeholder: "Groups" },
    { name: "author", placeholder: "Author" },
    { name: "categories", placeholder: "Categories" },
  ];

  const handleArrayOrStringChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const originalValue = comicData[name as keyof ComicData];

    if (Array.isArray(originalValue)) {
      // Jika user baru mengetik koma → jangan split dulu
      // biarkan koma muncul di input
      if (value.endsWith(",")) {
        const fakeEvent = {
          target: { name, value }, // biarkan string apa adanya dulu
        } as any;

        onChange(fakeEvent);
        return;
      }

      // Jika tidak diakhiri koma → boleh split
      const arr = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");

      const finalValue = arr.length === 0 ? null : arr;

      const fakeEvent = {
        target: { name, value: finalValue },
      } as any;

      onChange(fakeEvent);
      return;
    }

    // Jika STRING biasa
    onChange(e);
  };


  const handleClear = (name: string) => {
    const original = comicData[name as keyof ComicData];

    // jika array → kosongkan array
    if (Array.isArray(original)) {
      const fakeEvent = {
        target: { name, value: [] }, // bukan null
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(fakeEvent);
      return;
    }

    // jika string → ""
    const fakeEvent = {
      target: { name, value: "" },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(fakeEvent);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4">
      <div className="grid gap-4">
        {fields.map((field) => {
          const rawValue = comicData[field.name as keyof ComicData];
          const value = Array.isArray(rawValue)
            ? rawValue.join(", ")
            : rawValue;

          return (
            <InputText
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={typeof value === "string" ? value : ""}
              onChange={handleArrayOrStringChange}
              onClear={() => handleClear(field.name)}
            />
          );
        })}
      </div>
    </div>
  );

}
