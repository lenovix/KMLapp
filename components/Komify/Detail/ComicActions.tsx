"use client";

import { Star, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex flex-wrap items-center gap-6 mt-6">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onBookmark}
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs tracking-widest transition-all duration-300
          ${
            bookmarked
              ? "bg-yellow-500 text-zinc-950 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700"
          }
        `}
      >
        <Bookmark
          size={16}
          fill={bookmarked ? "currentColor" : "none"}
          className={bookmarked ? "animate-bounce" : ""}
        />
        {bookmarked ? "BOOKMARKED" : "BOOKMARK"}
      </motion.button>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">
            Rate this:
          </span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => onRate(star)}
                className="p-1 transition-colors"
              >
                <Star
                  size={22}
                  className={
                    userRating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-zinc-700 hover:text-zinc-500"
                  }
                  strokeWidth={2.5}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-zinc-500 fill-zinc-500" />
            <span className="text-sm font-black text-white">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-zinc-600 text-[10px] font-bold">/ 5.0</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-zinc-800" />
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
            Community Average
          </p>
        </div>
      </div>
    </div>
  );
}
