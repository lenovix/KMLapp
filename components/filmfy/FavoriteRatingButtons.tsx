"use client";

import { useEffect, useState } from "react";
import { Heart, Star, Loader2 } from "lucide-react";

interface FavoriteItem {
  filmId: number;
  addedAt: string;
}

export default function FavoriteRatingButtons({ filmId }: { filmId: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/filmfy/favorite")
      .then((r) => r.json())
      .then((data) => {
        const favorites: FavoriteItem[] = data.favorites ?? [];
        setIsFavorite(favorites.some((fav) => fav.filmId === filmId));
        setRating(data.ratings?.[filmId] ?? null);
      })
      .finally(() => setIsLoading(false));
  }, [filmId]);

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
    setRating(value);
    await fetch("/api/filmfy/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filmId, rating: value }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 h-10 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border dark:border-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Actions
        </span>

        <button
          onClick={toggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95 ${
            isFavorite
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-400"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-transform ${
              isFavorite ? "fill-current scale-110" : "group-hover:scale-110"
            }`}
          />
          <span className="text-sm font-semibold">
            {isFavorite ? "Saved" : "Save"}
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
