"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";

interface Props {
  filmId: number;
  initialFavorite: boolean;
  initialRating: number | null;
}

export default function FavoriteRatingButtons({
  filmId,
  initialFavorite,
  initialRating,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const toggleFavorite = async () => {
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    try {
      const res = await fetch("/api/filmfy/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmId }),
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      setIsFavorite(previousState);
    }
  };

  const submitRating = async (value: number) => {
    const previousRating = rating;
    setRating(value);

    try {
      const res = await fetch("/api/filmfy/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmId, rating: value }),
      });
      if (!res.ok) throw new Error();
    } catch (error) {
      setRating(previousRating);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border dark:border-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Actions
        </span>
        <button
          onClick={toggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95 group ${
            isFavorite
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-400"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-transform ${
              isFavorite
                ? "fill-current scale-110"
                : "group-hover:scale-110 text-red-400"
            }`}
          />
          <span className="text-sm font-semibold">
            {isFavorite ? "Favorited" : "Favorite"}
          </span>
        </button>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-800 w-full" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Your Rating:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => submitRating(i)}
              className="p-1 transition-transform active:scale-125"
            >
              <Star
                className={`w-6 h-6 transition-all duration-200 ${
                  (hoverRating ?? rating ?? 0) >= i
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                    : "text-gray-300 dark:text-gray-600 hover:text-yellow-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
