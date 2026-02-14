"use client";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Info,
  ExternalLink,
  Users,
  ChevronDown,
  ImageIcon,
  ImagePlus,
  FolderPlus,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import AddChapterModal from "@/components/Peoplefy/AddChapterModal";
import MediaViewer from "@/components/Peoplefy/MediaViewer";

export default function PersonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/peoplefy/people/${id}`);
        const data = await res.json();
        setPerson(data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (person?.chapters && person.chapters.length > 0) {
      setOpenChapters([person.chapters[0].id]);
    }
  }, [person]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Memuat data...
      </div>
    );
  if (!person)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Data tidak ditemukan.
      </div>
    );

  const toggleChapter = (id: number) => {
    setOpenChapters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const totalImages =
    person.chapters?.reduce(
      (acc: number, chap: any) => acc + chap.images.length,
      0,
    ) || 0;

  const handleSaveChapter = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/peoplefy/add-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: Number(id),
          title: data.title,
          description: data.description,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        setPerson((prev: any) => ({
          ...prev,
          chapters: [...prev.chapters, result.chapter],
        }));

        setIsChapterModalOpen(false);
        alert("Chapter dan Folder berhasil dibuat!");
      } else {
        alert("Gagal menyimpan chapter");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Terjadi kesalahan koneksi");
    }
  };

  const handleUploadMedia = async (
    chapterId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Hanya boleh upload gambar atau video!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("personId", String(person.id));
    formData.append("chapterId", String(chapterId));

    try {
      const response = await fetch("/api/peoplefy/upload-media", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPerson((prev: any) => {
          const newChapters = prev.chapters.map((c: any) => {
            if (c.id === chapterId) {
              return { ...c, images: [...c.images, result.url] };
            }
            return c;
          });
          return { ...prev, chapters: newChapters };
        });
        alert("Media berhasil diupload!");
      }
    } catch (error) {
      alert("Gagal upload media");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {selectedMedia && (
        <MediaViewer
          src={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/peoplefy"
            className="group flex items-center gap-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 p-2 pr-4 rounded-full text-slate-300 hover:text-white transition"
          >
            <div className="bg-slate-800 p-1 rounded-full group-hover:bg-blue-600 transition">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Koleksi</span>
          </Link>

          <div className="flex gap-2">
            <button className="p-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full hover:bg-slate-800 transition">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <img
              src={person.profileImage}
              alt={person.name}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-800 shadow-2xl mx-auto"
            />
            <div
              className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 border-4 border-[#020617] rounded-full"
              title="Active Account"
            ></div>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-bold text-[10px] uppercase tracking-widest">
              {person.tag}
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 font-bold text-[10px] uppercase tracking-widest">
              {person.status}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight italic">
            {person.name}
          </h1>
          {((person.birthDate && person.birthPlace) ||
            (person.lastPosition && person.lastCompany)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-sm">
              {person.birthDate && person.birthPlace && (
                <div className="flex flex-col items-center md:items-end gap-1 p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                    Personal Info
                  </span>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar size={14} className="text-blue-500" />
                    {person.birthDate}{" "}
                    {person.birthPlace ? `• ${person.birthPlace}` : ""}
                  </div>
                </div>
              )}

              {person.lastPosition && person.lastCompany && (
                <div className="flex flex-col items-center md:items-start gap-1 p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                    Current Role
                  </span>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={14} className="text-blue-500" />
                    {person.lastPosition} at {person.lastCompany}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {person.socials?.map((soc: any) => (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-blue-500 transition-all flex items-center gap-2 group"
              >
                {soc.platform}
                <ExternalLink
                  size={12}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-6 border-y border-slate-800/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalImages}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                Images
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {person.family?.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                Family
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {person.chapters?.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                Chapters
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {((person.family && person.family.length > 0) ||
          (person.newsLinks && person.newsLinks.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {person.family && person.family.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                <h3 className="flex items-center gap-2 text-white font-bold mb-4">
                  <Users size={18} className="text-blue-400" /> Keluarga
                </h3>
                <div className="space-y-3">
                  {person.family?.map((f: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-slate-800 pb-2"
                    >
                      <span className="text-slate-300">{f.name}</span>
                      <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                        {f.relation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {person.newsLinks && person.newsLinks.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                <h3 className="flex items-center gap-2 text-white font-bold mb-4">
                  <Info size={18} className="text-blue-400" /> News & Links
                </h3>
                <div className="space-y-3">
                  {person.newsLinks?.map((link: string, i: number) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      className="block text-sm text-blue-400 hover:underline truncate"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-end mb-12">
          <div className="flex-1 text-center translate-x-12">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500">
              Timeline Chapters
            </h2>
          </div>

          <button
            onClick={() => setIsChapterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <FolderPlus size={16} />
            <span className="hidden md:inline">Chapter Baru</span>
          </button>
        </div>
        <div className="space-y-6">
          {person.chapters?.map((chapter: any) => {
            const isOpen = openChapters.includes(chapter.id);

            return (
              <div
                key={chapter.id}
                className="border border-slate-800 rounded-4xl overflow-hidden bg-slate-900/20 backdrop-blur-sm transition-all duration-300"
              >
                <div className="flex items-center w-full pr-6 group/item">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex-1 flex items-center gap-5 p-6 md:p-8 transition-colors text-left"
                  >
                    <div
                      className={`p-3 rounded-2xl ${isOpen ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"} transition-colors shadow-lg`}
                    >
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {chapter.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {chapter.images.length} Photos •{" "}
                        {chapter.description.substring(0, 50)}...
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id={`upload-${chapter.id}`}
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={(e) => handleUploadMedia(chapter.id, e)}
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById(`upload-${chapter.id}`)
                          ?.click();
                      }}
                      className="p-3 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90"
                      title="Tambah Gambar/Video"
                    >
                      <ImagePlus size={20} />
                    </button>

                    <div
                      onClick={() => toggleChapter(chapter.id)}
                      className={`p-2 rounded-full border border-slate-700 transition-transform duration-300 ${isOpen ? "rotate-180 bg-slate-800" : "rotate-0"}`}
                    >
                      <ChevronDown size={20} className="text-slate-400" />
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="p-6 md:p-8 pt-0 border-t border-slate-800/50">
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      {chapter.description}
                    </p>

                    <div className="max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {chapter.images.map((img: string, idx: number) => {
                          const isVideo = img.match(/\.(mp4|webm|ogg)$/i);

                          return (
                            <div
                              key={idx}
                              className="aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group cursor-pointer relative"
                            >
                              {isVideo ? (
                                <video
                                  src={img}
                                  className="w-full h-full object-cover"
                                  muted
                                  onClick={() => setSelectedMedia(img)}
                                />
                              ) : (
                                <img
                                  src={img}
                                  alt="Media"
                                  onClick={() => setSelectedMedia(img)}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              )}
                              {isVideo && (
                                <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md">
                                  <Play size={12} className="text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <AddChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onSave={handleSaveChapter}
      />
    </div>
  );
}
