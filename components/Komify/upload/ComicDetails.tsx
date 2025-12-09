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

    // Jika field berupa ARRAY → convert string ke array
    if (Array.isArray(originalValue)) {
      const arr = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");

      const fakeEvent = {
        ...e,
        target: { name, value: arr },
      };

      onChange(fakeEvent as any);
      return;
    }

    // Jika bukan array → langsung kirim
    onChange(e);
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
              value={value}
              onChange={handleArrayOrStringChange}
            />
          );
        })}
      </div>
    </div>
  );

}
