"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, Crop, Check, Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";

interface CoverViewerProps {
  code: string;
  coverUrl: string;
  onClose: () => void;
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any
): Promise<Blob> => {
  const image = new window.Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/jpeg",
      0.95
    );
  });
};

export default function CoverViewer({
  code,
  coverUrl,
  onClose,
}: CoverViewerProps) {
  const [isCropping, setIsCropping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [imgSrc, setImgSrc] = useState(
    `/filmfy/movie/${code}/cover_original.jpg?v=${Date.now()}`
  );

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsSaving(true);

      const blob = await getCroppedImg(imgSrc, croppedAreaPixels);

      const formData = new FormData();
      formData.append("code", code);
      formData.append("croppedImage", blob, "cover.jpg");

      const res = await fetch("/api/filmfy/re-crop", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan hasil crop");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col">
      <div className="p-4 flex justify-between items-center text-white bg-black/20">
        <div className="flex gap-3">
          {!isCropping ? (
            <button
              onClick={() => setIsCropping(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-sm transition active:scale-95"
            >
              <Crop className="w-4 h-4" /> RE-CROP IMAGE
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsCropping(false)}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-bold hover:text-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCrop}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-2xl font-black text-sm transition active:scale-95 disabled:bg-gray-600"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isSaving ? "SAVING..." : "APPLY CROP"}
              </button>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          disabled={isSaving}
          className="p-2 hover:bg-white/10 rounded-full transition disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-6">
        {isCropping ? (
          <div className="relative w-full max-w-2xl aspect-[3/4.5] overflow-hidden rounded-2xl shadow-2xl bg-gray-900">
            <Cropper
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4.5}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        ) : (
          <div className="relative w-full max-w-md aspect-[3/4.5] shadow-2xl rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={coverUrl}
              alt="Cover Preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </div>

      {isCropping && (
        <div className="p-8 bg-black/40 flex justify-center">
          <div className="w-full max-w-xs space-y-2">
            <p className="text-[10px] font-black text-center text-gray-500 uppercase tracking-widest">
              Zoom Level
            </p>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
