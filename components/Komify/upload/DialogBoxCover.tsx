"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Scissors, RefreshCw } from "lucide-react";
import Cropper from "react-easy-crop";

interface DialogBoxCoverProps {
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
}

export default function DialogBoxCover({
  open,
  onClose,
  onSave,
}: DialogBoxCoverProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return alert("File harus berupa gambar.");
    if (file.size > 5 * 1024 * 1024) return alert("Maksimal 5MB.");

    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const onCropComplete = useCallback((_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const createCroppedImage = async () => {
    if (!preview || !croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = preview;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "cover_cropped.jpg", {
            type: "image/jpeg",
          });
          onSave(croppedFile);
        }
      }, "image/jpeg", 0.9);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center z-110 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                  <Scissors size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase">Adjust Cover</h2>
                  <p className="text-[10px] text-zinc-500 font-medium">3:4 Ratio Supported</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500"><X size={18} /></button>
            </div>

            <div className="p-6">
              <div
                className={`
                  relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center 
                  transition-all duration-500 aspect-3/4 max-h-[380px] mx-auto overflow-hidden group
                  ${preview ? "border-zinc-700 bg-zinc-950" : "border-zinc-800 bg-zinc-950/50 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer"}
                `}
              >
                {!preview ? (
                  <div
                    className="flex flex-col items-center gap-4 w-full h-full justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500">
                      <UploadCloud size={32} className="text-zinc-600 group-hover:text-blue-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-zinc-300 text-sm font-semibold tracking-tight">Drop or Click to Upload</p>
                      <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest font-black opacity-60">Max 5MB (JPG/PNG)</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full h-full z-0">
                      <Cropper
                        image={preview}
                        crop={crop}
                        zoom={zoom}
                        aspect={3 / 4}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

                    <div className="absolute center top-4 right-4 z-20">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="
                          flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-white/10 
                          p-2 pr-4 rounded-full text-white shadow-2xl 
                          translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                          transition-all duration-300 hover:bg-blue-600 hover:border-blue-400
                        "
                      >
                        <div className="bg-white/10 p-1.5 rounded-full">
                          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider">Change Image</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {preview && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <span>Zoom Control</span>
                    <span className="text-blue-400">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-zinc-800">
                <button
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all"
                  onClick={onClose}
                >
                  CANCEL
                </button>

                <button
                  className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg ${preview
                    ? "bg-blue-600 hover:bg-blue-500 text-white active:scale-95"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  onClick={createCroppedImage}
                  disabled={!preview}
                >
                  SAVE COVER
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}