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

export default function ComicDetails({ comicData, onChange }: ComicDetailsProps) {
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4">
      <div className="grid gap-4">
        {fields.map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={comicData[field.name as keyof ComicData]}
            onChange={onChange}
            className="border p-2 rounded w-full bg-white/10 text-white placeholder-gray-300"
          />
        ))}
      </div>
    </div>
  );
}
