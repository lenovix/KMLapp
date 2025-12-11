import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface ChapterItem {
  number: number;
  title: string;
  uploadChapter: string;
}

interface ChaptersListProps {
  comicSlug: Number;
  chapters: ChapterItem[];
  onAddChapter: () => void;
}

export default function ChaptersList({
  comicSlug,
  chapters,
  onAddChapter,
}: ChaptersListProps) {
  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">📖 Chapters</h2>

        <button
          onClick={onAddChapter}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
        >
          + Tambah Chapter
        </button>
      </div>

      {/* Chapter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {chapters.map((ch) => (
          <Link
            key={ch.number}
            href={`/reader/${comicSlug}/${ch.number}`}
            className="border rounded-lg p-4 bg-white hover:shadow"
          >
            <div className="font-bold text-blue-700 text-lg">
              Chapter {ch.number}
            </div>
            <div className="text-gray-700">{ch.title}</div>
            <div className="text-xs text-gray-500 mt-2">
              {dayjs(ch.uploadChapter).fromNow()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
