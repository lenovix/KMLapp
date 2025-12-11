"use client";

interface ComicActionsProps {
  bookmarked: boolean;
  userRating: number;
  avgRating: number;
  onBookmark: () => void;
  onRate: (star: number) => void;
}

export default function ComicActions({
  bookmarked,
  userRating,
  avgRating,
  onBookmark,
  onRate,
}: ComicActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-auto">
      {/* Bookmark */}
      <button
        onClick={onBookmark}
        className={`px-4 py-2 rounded-xl shadow text-white transition active:scale-95 ${
          bookmarked
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-slate-700 hover:bg-slate-600"
        }`}
      >
        {bookmarked ? "★ Bookmark" : "☆ Bookmark"}
      </button>

      {/* Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className="text-2xl text-yellow-400 hover:scale-110 transition"
          >
            {userRating >= star ? "★" : "☆"}
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-400">({avgRating}/5)</span>
      </div>
    </div>
  );
}
