"use client";

import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";

export default function FavoriteRatingButtons({ filmId }: { filmId: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/filmfy/favorite")
      .then((r) => r.json())
      .then((data) => {
        setIsFavorite(data.favorites.includes(filmId));
        setRating(data.ratings?.[filmId] ?? null);
      });
  }, [filmId]);

  const toggleFavorite = async () => {
    const res = await fetch("/api/filmfy/favorite", {
      method: "POST",
      body: JSON.stringify({ filmId }),
    });
    const data = await res.json();
    setIsFavorite(data.isFavorite);
  };

  const submitRating = async (value: number) => {
    await fetch("/api/filmfy/rating", {
      method: "POST",
      body: JSON.stringify({ filmId, rating: value }),
    });
    setRating(value);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleFavorite}
        className={`p-2 rounded-xl border transition ${
          isFavorite
            ? "bg-red-100 text-red-600"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
      </button>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onClick={() => submitRating(i)}>
            <Star
              className={`w-4 h-4 ${
                rating && rating >= i
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
