"use client";

import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";

interface FavoriteItem {
  filmId: number;
  addedAt: string;
}

export default function FavoriteRatingButtons({ filmId }: { filmId: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/filmfy/favorite")
      .then((r) => r.json())
      .then((data) => {
        const favorites: FavoriteItem[] = data.favorites ?? [];

        setIsFavorite(favorites.some((fav) => fav.filmId === filmId));

        setRating(data.ratings?.[filmId] ?? null);
      });
  }, [filmId]);

  const toggleFavorite = async () => {
    const res = await fetch("/api/filmfy/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filmId }),
    });

    const data = await res.json();
    setIsFavorite(data.isFavorite);
  };

  const submitRating = async (value: number) => {
    await fetch("/api/filmfy/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filmId, rating: value }),
    });

    setRating(value);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleFavorite}
        title="Favorite"
        className={`p-2 rounded-xl border transition ${
          isFavorite
            ? "bg-red-100 text-red-600 border-red-200"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <Heart
          className={`w-5 h-5 transition ${
            isFavorite ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </button>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onClick={() => submitRating(i)} title={`Rate ${i}`}>
            <Star
              className={`w-4 h-4 transition ${
                rating && rating >= i
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
