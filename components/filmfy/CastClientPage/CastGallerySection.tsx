"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface CastGallerySectionProps {
  images?: string[];
  onSave?: (images: string[]) => void;
}

export default function CastGallerySection({
  images: initialImages = [],
  onSave,
}: CastGallerySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>(initialImages);
  const [newImage, setNewImage] = useState("");

  const addImage = () => {
    if (!newImage.trim()) return;
    setImages((prev) => [...prev, newImage.trim()]);
    setNewImage("");
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(images);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative">
      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4 flex items-center gap-1
                   text-sm text-blue-600 hover:underline"
      >
        <Pencil className="w-4 h-4" />
        Edit
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Foto / Screenshot Pemeran
      </h2>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <Image
              src={img}
              alt={`Gallery ${index + 1}`}
              width={300}
              height={300}
              className="rounded-xl object-cover w-full h-full"
            />

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

        {/* Add Image */}
        {isEditing && (
          <div
            className="flex flex-col items-center justify-center
                       border-2 border-dashed rounded-xl
                       p-4 text-sm text-gray-500"
          >
            <input
              type="text"
              placeholder="URL gambar"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full px-2 py-1 mb-2 rounded-lg border
                         dark:border-gray-700 bg-white dark:bg-gray-900"
            />
            <button
              onClick={addImage}
              className="inline-flex items-center gap-1
                         px-3 py-1 rounded-lg
                         bg-blue-600 text-white text-xs"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>
        )}
      </div>

      {/* Save */}
      {isEditing && (
        <div className="mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl
                       bg-blue-600 text-white text-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      )}
    </section>
  );
}
