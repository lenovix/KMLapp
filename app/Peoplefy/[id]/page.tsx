"use client";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Info,
  ExternalLink,
  Users,
  ChevronDown,
  ImageIcon,
  ImagePlus,
  FolderPlus,
  Play,
  Trash2,
  X,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import AddChapterModal from "@/components/Peoplefy/AddChapterModal";
import MediaViewer from "@/components/Peoplefy/MediaViewer";

export default function PersonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
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
    setOpenChapters([]);
  }, [person?.id]);

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

  const handleDeletePerson = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus semua data orang ini? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      const res = await fetch(`/api/peoplefy/people/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Data berhasil dihapus");
        router.push("/peoplefy");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!confirm("Hapus chapter ini beserta semua isinya?")) return;

    try {
      const res = await fetch(`/api/peoplefy/chapters/${chapterId}`, { method: "DELETE" });
      if (res.ok) {
        setPerson((prev: any) => ({
          ...prev,
          chapters: prev.chapters.filter((c: any) => c.id !== chapterId),
        }));
      }
    } catch (error) {
      console.error("Delete chapter error:", error);
    }
  };

  const handleDeleteMedia = async (chapterId: number, mediaUrl: string) => {
    try {
      const res = await fetch(`/api/peoplefy/delete-media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, mediaUrl }),
      });

      if (res.ok) {
        setPerson((prev: any) => {
          const newChapters = prev.chapters.map((c: any) => {
            if (c.id === chapterId) {
              return { ...c, images: c.images.filter((img: string) => img !== mediaUrl) };
            }
            return c;
          });
          return { ...prev, chapters: newChapters };
        });
      }
    } catch (error) {
      console.error("Delete media error:", error);
    }
  };

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
    const files = e.target.files;

    if (!files || files.length === 0) return;
    if (typeof window === "undefined") return;

    const fileArray = Array.from(files);
    const successfullyUploaded: string[] = [];

    try {
      const heicModule = await import("heic2any");
      const heic2any = heicModule.default;

      for (const file of fileArray) {
        const isHEIC = file.name.toLowerCase().endsWith(".heic") ||
          file.type === "image/heic" ||
          file.type === "image/heif";

        const isImage = file.type.startsWith("image/") || isHEIC;
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) continue;

        let fileToUpload: File | Blob = file;

        if (isHEIC) {
          try {
            console.log(`Memulai konversi: ${file.name}`);

            const arrayBuffer = await file.arrayBuffer();
            const blobToConvert = new Blob([arrayBuffer], { type: "image/heic" });

            const convertedBlob = await heic2any({
              blob: blobToConvert,
              toType: "image/jpeg",
              quality: 0.8,
            });

            const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

            fileToUpload = new File([finalBlob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
              type: "image/jpeg",
            });

            console.log("Konversi Berhasil!");
          } catch (convError: any) {
            console.warn("Konversi HEIC dilewati (Fallback aktif). File akan diupload dalam format asli.");
            fileToUpload = file;
          }
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("personId", String(person.id));
        formData.append("chapterId", String(chapterId));

        const response = await fetch("/api/peoplefy/upload-media", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          successfullyUploaded.push(result.url);

          setPerson((prev: any) => {
            const newChapters = prev.chapters.map((c: any) => {
              if (c.id === chapterId) {
                return { ...c, images: [...c.images, result.url] };
              }
              return c;
            });
            return { ...prev, chapters: newChapters };
          });
        }
      }

      if (successfullyUploaded.length > 0) {
        alert(`${successfullyUploaded.length} file berhasil diupload!`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan sistem saat upload.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {selectedMedia && (
        <MediaViewer src={selectedMedia} onClose={() => setSelectedMedia(null)} />
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

          <div className="flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-1.5 rounded-2xl shadow-2xl">
            <Link
              href={`/peoplefy/edit/${person.id}`}
              className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
            >
              <Edit size={16} />
              <span>Edit</span>
            </Link>

            <div className="w-px h-6 bg-slate-700/50 mx-1" />

            <button
              onClick={handleDeletePerson}
              className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-purple-600 rounded-full blur-md opacity-20 animate-pulse" />
            <div className="relative p-1 bg-slate-800/50 rounded-full backdrop-blur-sm border border-white/10">
              <img
                src={person.profileImage}
                alt={person.name}
                className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-2 border-slate-900 shadow-2xl"
              />
              <div
                className="absolute bottom-4 right-4 bg-green-500 w-6 h-6 border-4 border-[#020617] rounded-full shadow-lg"
                title="Active Account"
              >
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {[
              { label: person.tag, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { label: person.status, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/20' }
            ].map((badge, i) => (
              <span key={i} className={`px-4 py-1.5 ${badge.bg} border ${badge.border} ${badge.color} rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-sm`}>
                {badge.label}
              </span>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
            {person.name}
          </h1>

          {((person.birthDate && person.birthPlace) || (person.lastPosition && person.lastCompany)) && (
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-3xl mx-auto mb-12">
              {(person.birthDate || person.birthPlace) && (
                <div className="flex-1 flex items-center gap-4 p-5 bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 rounded-xl text-blue-400">
                    <Calendar size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Born</p>
                    <p className="text-slate-200 text-sm font-medium leading-tight">
                      {person.birthDate} <span className="text-slate-600 mx-1">/</span> {person.birthPlace}
                    </p>
                  </div>
                </div>
              )}

              {person.lastPosition && person.lastCompany && (
                <div className="flex-1 flex items-center gap-4 p-5 bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center bg-purple-500/10 rounded-xl text-purple-400">
                    <MapPin size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Current Role</p>
                    <p className="text-slate-200 text-sm font-medium leading-tight">
                      {person.lastPosition} <span className="text-slate-500 font-normal">at</span> {person.lastCompany}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {person.socials?.map((soc: any) => (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center gap-2 group"
              >
                {soc.platform}
                <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {((person.family && person.family.length > 0) ||
            (person.newsLinks && person.newsLinks.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">

                {person.family && person.family.length > 0 && (
                  <div className="group bg-white/2 hover:bg-white/4 border border-white/5 p-8 rounded-4xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="flex items-center gap-3 text-white font-bold text-lg">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Users size={20} className="text-blue-400" />
                        </div>
                        Family Tree
                      </h3>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full">
                        {person.family.length} Members
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {person.family?.map((f: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-3 rounded-xl border border-white/3 bg-white/1 hover:bg-white/3 transition-colors group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/item:bg-blue-400 transition-colors" />
                            <span className="text-slate-200 font-medium text-sm">{f.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter border border-slate-800 px-2 py-0.5 rounded-md group-hover/item:border-slate-700 transition-colors">
                            {f.relation}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {person.newsLinks && person.newsLinks.length > 0 && (
                  <div className="group bg-white/2 hover:bg-white/4 border border-white/5 p-8 rounded-4xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="flex items-center gap-3 text-white font-bold text-lg">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <Info size={20} className="text-purple-400" />
                        </div>
                        Featured News
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {person.newsLinks?.map((link: string, i: number) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 rounded-xl border border-white/3 bg-white/1 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all group/link"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-400 group-hover/link:text-blue-400 transition-colors truncate">
                              {link.replace(/^https?:\/\/(www\.)?/, '')}
                            </p>
                          </div>
                          <ExternalLink size={14} className="text-slate-600 group-hover/link:text-blue-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto py-8 px-4 border-y border-white/5 relative">
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-px h-8 bg-linear-to-b from-transparent via-slate-700 to-transparent md:block hidden" />
            <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-px h-8 bg-linear-to-b from-transparent via-slate-700 to-transparent md:block hidden" />

            {[
              { val: totalImages, label: 'Images' },
              { val: person.family?.length, label: 'Family' },
              { val: person.chapters?.length, label: 'Chapters' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl font-black text-white group-hover:scale-110 transition-transform duration-300">
                  {stat.val || 0}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500 mb-1">
              Timeline Chapters
            </h2>
            <p className="text-slate-400 text-xs">Jelajahi setiap momen berharga</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center p-1 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl">
              <button
                onClick={() => setOpenChapters(person.chapters.map((c: any) => c.id))}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
              >
                Expand All
              </button>
              <div className="w-px h-4 bg-slate-800 mx-1" />
              <button
                onClick={() => setOpenChapters([])}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
              >
                Collapse All
              </button>
            </div>

            <button
              onClick={() => setIsChapterModalOpen(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-900/40 active:scale-95 w-full md:w-auto justify-center border border-blue-400/30"
            >
              <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                <FolderPlus size={16} />
              </div>
              <span>NEW CHAPTER</span>
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {person.chapters?.map((chapter: any) => {
            const isOpen = openChapters.includes(chapter.id);
            const firstImage = chapter.images?.[0];
            const isVideo = firstImage?.match(/\.(mp4|webm|ogg)$/i);

            return (
              <div
                key={chapter.id}
                className={`group border transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col ${isOpen
                  ? "col-span-1 md:col-span-2 lg:col-span-3 border-blue-500/50 bg-slate-900/40"
                  : "border-slate-800 bg-slate-900/20 hover:border-slate-600 hover:bg-slate-900/40"
                  }`}
              >
                <div
                  onClick={() => toggleChapter(chapter.id)}
                  className="cursor-pointer flex flex-col h-full"
                >
                  {!isOpen && (
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                      {firstImage ? (
                        isVideo ? (
                          <video src={firstImage} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" muted />
                        ) : (
                          <img src={firstImage} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={40} className="text-slate-800" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent" />
                      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                        <div className="bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                          <ImageIcon size={12} />
                          {chapter.images.length} Media
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className={`font-bold transition-all ${isOpen ? "text-3xl text-blue-400" : "text-xl text-white group-hover:text-blue-400"}`}>
                          {chapter.title}
                        </h3>
                        <p className={`text-slate-500 text-sm mt-2 line-clamp-2 ${isOpen ? "hidden" : "block"}`}>
                          {chapter.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="p-2.5 bg-slate-800/50 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => document.getElementById(`upload-${chapter.id}`)?.click()}
                          className="p-2.5 bg-slate-800/50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all"
                          title="Upload"
                        >
                          <ImagePlus size={16} />
                          <input
                            type="file"
                            id={`upload-${chapter.id}`}
                            className="hidden"
                            accept="image/*,video/*"
                            multiple
                            onChange={(e) => handleUploadMedia(chapter.id, e)}
                          />
                        </button>
                        <div className={`p-2 rounded-full border border-slate-700 transition-transform duration-500 ${isOpen ? "rotate-180 bg-blue-600 border-blue-500" : ""}`}>
                          <ChevronDown size={16} className={isOpen ? "text-white" : "text-slate-500"} />
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-3xl">
                          {chapter.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {chapter.images.map((img: string, idx: number) => {
                            const isMediaVideo = img.match(/\.(mp4|webm|ogg)$/i);
                            return (
                              <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group/media cursor-pointer relative shadow-xl">
                                <button
                                  onClick={() => handleDeleteMedia(chapter.id, img)}
                                  className="absolute top-2 left-2 z-10 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover/media:opacity-100 transition-opacity hover:bg-red-500 shadow-xl"
                                >
                                  <X size={12} />
                                </button>
                                {isMediaVideo ? (
                                  <video src={img} className="w-full h-full object-cover" muted onClick={() => setSelectedMedia(img)} />
                                ) : (
                                  <img src={img} alt="" onClick={() => setSelectedMedia(img)} className="w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-700" />
                                )}
                                {isMediaVideo && (
                                  <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md">
                                    <Play size={12} className="text-white" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className="mt-8 text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2 mx-auto uppercase tracking-widest"
                        >
                          Tutup Chapter
                        </button>
                      </div>
                    )}
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
