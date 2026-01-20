"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

interface CastGallerySectionProps {
  slug: string;
  images?: string[];
  onUploaded?: () => void;
}

export default function CastGallerySection({
  slug,
  images: initialImages = [],
  onUploaded,
}: CastGallerySectionProps) {
  const [showSlider, setShowSlider] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const sorted = [...initialImages].sort((a, b) => {
      const getTime = (url: string) => {
        const name = url.split("/").pop() || "";
        const ts = parseInt(name.split("-")[0]);
        return isNaN(ts) ? 0 : ts;
      };

      return getTime(b) - getTime(a);
    });

    setImages(sorted);
  }, [initialImages]);

  useEffect(() => {
    if (!showSlider) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSlider(false);
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showSlider, images.length]);

  const openSlider = (index: number) => {
    if (isEditing) return;
    setActiveIndex(index);
    setShowSlider(true);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const uploadImages = async (files: File[]) => {
    try {
      setUploading(true);

      for (const file of files) {
        const formData = new FormData();
        formData.append("slug", slug);
        formData.append("file", file);

        const res = await fetch("/api/filmfy/addGalleryCast", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.image) {
          setImages((prev) => [data.image, ...prev]);
        }
      }

      onUploaded?.();
    } catch (err) {
      console.error("Upload multi gagal", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      const filename = imageUrl.split("/").pop();
      if (!filename) return;

      const res = await fetch("/api/filmfy/deleteGalleryCast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          filename,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setImages((prev) => prev.filter((img) => img !== imageUrl));
        onUploaded?.();
      }
    } catch (err) {
      console.error("Gagal hapus gambar", err);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1
              text-sm bg-blue-600 text-white
              px-3 py-1 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1
              text-sm bg-green-600 text-white
              px-3 py-1 rounded-lg"
          >
            Selesai
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {isEditing && (
          <label
            className="flex flex-col items-center justify-center
              border-2 border-dashed rounded-xl
              p-4 text-sm text-gray-500
              cursor-pointer hover:border-blue-500"
          >
            <Plus className="w-6 h-6 mb-2" />
            {uploading ? "Mengupload..." : "Tambah Foto"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) uploadImages(files);
                e.currentTarget.value = "";
              }}
            />
          </label>
        )}

        {images.map((img, index) => (
          <div
            key={img}
            className="relative group cursor-pointer"
            onClick={() => openSlider(index)}
          >
            <div className="aspect-3/4 max-h-40 overflow-hidden rounded-xl">
              <Image
                src={img}
                alt="Gallery"
                fill
                className="object-cover group-hover:scale-105 transition"
              />
            </div>

            {!isEditing && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition rounded-xl" />
            )}

            {isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img);
                }}
                className="absolute top-2 right-2
                  bg-red-600 text-white
                  p-1 rounded-lg"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {showSlider && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setShowSlider(false)}
            className="absolute top-4 right-4
              p-2 rounded-full
              text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevSlide}
            className="absolute left-4
              p-2 rounded-full
              text-white hover:bg-white/10 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image */}
          <div className="relative w-[90vw] max-w-3xl aspect-3/4">
            <Image
              src={images[activeIndex]}
              alt="Slide"
              fill
              className="object-contain rounded-xl"
            />
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-4
              p-2 rounded-full
              text-white hover:bg-white/10 transition"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-6 text-white text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
