"use client";

interface FilterTagsProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export default function FilterTags({
  tags,
  selectedTags,
  onToggleTag,
}: FilterTagsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        TAGS:
      </span>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all border
              ${
                active
                  ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.03]"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
