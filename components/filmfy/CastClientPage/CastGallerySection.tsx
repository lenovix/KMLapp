"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🔥 PENTING: sync props -> state
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("file", file);

      const res = await fetch("/api/filmfy/addGalleryCast", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.image) {
        // Optimistic UI
        setImages((prev) => [...prev, data.image]);
        onUploaded?.(); // trigger router.refresh()
      }
    } catch (err) {
      console.error("Upload gagal", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    // ⚠️ sementara hanya hapus dari UI
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative">
      {/* Action Buttons */}
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
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1
                   text-sm bg-green-600 text-white
                   px-3 py-1 rounded-lg"
            >
              Selesai
            </button>
          </>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Gallery
      </h2>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Upload Box */}
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
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
              }}
            />
          </label>
        )}
        {images.map((img, index) => (
          <div key={img} className="relative group">
            <div className="aspect-3/4 max-h-40 overflow-hidden rounded-xl">
              <Image
                src={img}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>

            {isEditing && (
              <button
                onClick={() => removeImage(index)}
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
    </section>
  );
}
